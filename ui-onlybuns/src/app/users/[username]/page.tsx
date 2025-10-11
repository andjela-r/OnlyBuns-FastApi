import ProfilePage from '../../profile/page';

export default async function Profile({ params }: { params: { username: string } }) {
    const resolvedParams = await params;
    const { username } = resolvedParams;
    
    if (!username || username.trim() === '') {
        return <div className="flex justify-center items-center h-screen text-red-500">Invalid username</div>;
    }
    
    return <ProfilePage username={username} />;
}