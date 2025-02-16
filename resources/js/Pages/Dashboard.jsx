import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Home from './Home';

const Dashboard = ({ children, ...props }) => {
    return <Home {...props}>{children}</Home>;
};

Dashboard.layout = (page) => (
    <AuthenticatedLayout>
        <Dashboard {...page.props}>{page}</Dashboard>
    </AuthenticatedLayout>
);

export default Dashboard;
