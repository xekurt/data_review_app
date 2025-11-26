export default function Loading() {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">Loading data...</p>
            </div>
        </div>
    );
}