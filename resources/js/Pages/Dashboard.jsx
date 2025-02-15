
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Home from './Home';

function Dashboard() {
    return (
        <></>
    );
}

Dashboard.layout = page => (
    <AuthenticatedLayout>
        <Home children={page} />
    </AuthenticatedLayout>
)

export default Dashboard;
