import { useUser } from "@clerk/clerk-react";
import Layout from "../layouts/Layout";

interface Video {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
    description: string;
}

const mockVideos: Video[] = [
    {
        id: "1",
        title: "Entrenamiento Básico",
        thumbnail: "https://placehold.co/600x400",
        url: "https://example.com/video1",
        description: "Rutina de entrenamiento básico para principiantes"
    },
    {
        id: "2",
        title: "Técnicas Avanzadas",
        thumbnail: "https://placehold.co/600x400",
        url: "https://example.com/video2",
        description: "Técnicas avanzadas de entrenamiento"
    },
    {
        id: "3",
        title: "Rutina de Cardio",
        thumbnail: "https://placehold.co/600x400",
        url: "https://example.com/video3",
        description: "Sesión intensiva de cardio"
    }
];

export default function VideosPage(){
    const { user } = useUser();
    
    return(
        <Layout user={user} loading={false}>
            <main className="bg-gray-800 text-white p-6 w-full min-h-screen mb-24">
                <h1 className="text-2xl font-bold mb-8">👋 Buenos días {user?.firstName}!</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockVideos.map((video) => (
                        <div key={video.id} className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                            <img 
                                src={video.thumbnail} 
                                alt={video.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                                <p className="text-gray-300">{video.description}</p>
                                <button 
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    onClick={() => window.open(video.url, '_blank')}
                                >
                                    Ver Video
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </Layout>
    );
}
