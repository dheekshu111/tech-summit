import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Header } from './Header';

export function Layout() {
    return (
        <div style={{ paddingBottom: '100px' }}>
            <Header />
            <main>
                {/* Child routes render here */}
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
