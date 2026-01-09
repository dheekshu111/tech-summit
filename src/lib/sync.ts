import { db } from './db';
import { supabase } from './supabase';

const TABLES = ['sessions', 'booths', 'connections'] as const;

export async function syncData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Cannot sync if not logged in

    console.log('🔄 Starting Sync...');

    for (const tableName of TABLES) {
        // 1. PUSH: Find unsynced local items
        const unsyncedItems = await db.table(tableName)
            .where('synced')
            .equals(0)
            .toArray();

        if (unsyncedItems.length > 0) {
            console.log(`📤 Pushing ${unsyncedItems.length} ${tableName}...`);

            // Clean data for Supabase (remove 'synced' field if needed, or map it)
            // We need to ensure 'user_id' is set if your schema requires it.
            // Assuming RLS handles 'auth.uid()', we just send the data.
            // But we need to make sure the schema matches.

            const recordsToPush = unsyncedItems.map(item => {
                // Exclude 'synced' (local flag) and 'audioBlob' (local-only storage)
                const { synced, audioBlob, ...rest } = item;
                return {
                    ...rest,
                    user_id: user.id, // Explicitly set owner
                    updated_at: new Date().toISOString()
                };
            });

            const { error } = await supabase
                .from(tableName)
                .upsert(recordsToPush);

            if (!error) {
                // Mark as synced locally
                await db.table(tableName).bulkPut(
                    unsyncedItems.map(item => ({ ...item, synced: 1 }))
                );
            } else {
                console.error(`Error pushing ${tableName}:`, error);
            }
        }

        // 2. PULL: Get latest from Cloud
        // Use smart merge: only update local items if remote is newer
        const { data: remoteItems, error: pullError } = await supabase
            .from(tableName)
            .select('*');

        if (pullError) {
            console.error(`Error pulling ${tableName}:`, pullError);
            continue;
        }

        if (remoteItems && remoteItems.length > 0) {
            console.log(`📥 Pulling ${remoteItems.length} ${tableName}...`);

            // Get all local items to compare timestamps
            const localItems = await db.table(tableName).toArray();
            const localItemsMap = new Map(localItems.map(item => [item.id, item]));

            const itemsToUpdate = [];

            for (const remoteItem of remoteItems) {
                const localItem = localItemsMap.get(remoteItem.id);

                // If item doesn't exist locally, add it
                if (!localItem) {
                    itemsToUpdate.push({
                        ...remoteItem,
                        synced: 1
                    });
                    continue;
                }

                // Compare timestamps - only update if remote is newer
                const remoteTime = new Date(remoteItem.updated_at).getTime();
                const localTime = localItem.updated_at ? new Date(localItem.updated_at).getTime() : 0;

                if (remoteTime > localTime) {
                    // Remote is newer, update local
                    itemsToUpdate.push({
                        ...remoteItem,
                        synced: 1
                    });
                    console.log(`  ↓ Updating ${tableName} ${remoteItem.id.substring(0, 8)}... (remote newer)`);
                } else {
                    console.log(`  ⏭ Skipping ${tableName} ${remoteItem.id.substring(0, 8)}... (local is newer or same)`);
                }
            }

            if (itemsToUpdate.length > 0) {
                await db.table(tableName).bulkPut(itemsToUpdate);
                console.log(`  ✓ Updated ${itemsToUpdate.length} items`);
            }
        }
    }

    console.log('✅ Sync Complete');
}
