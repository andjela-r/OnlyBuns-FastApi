export default async function Profile({ params }: { params: { id: string } }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const [first, second] = id.split("_");
    return <h1>Profile: {first} {second}</h1>;
}