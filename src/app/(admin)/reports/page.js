"use client";

import { useState } from "react";

export default function ReportedPosts() {
  const [reportedPosts, setReportedPosts] = useState([
    {
      id: "post_1",
      content: "Bu platformda başka üniversitenin reklamı yapılıyor!",
      author: "Ahmet Y.",
      userImg: "https://ui-avatars.com/api/?name=Ahmet+Y&background=dc2626&color=fff",
      postImg: null,
      createdAt: "2026-05-01T14:20:00Z",
      reports: [
        { id: "rep_1", message: "Gereksiz içerik.", reporter: "Mehmet K." },
        { id: "rep_2", message: "Kurallara aykırı.", reporter: "Ayşe T." },
      ],
    },
    {
      id: "post_2",
      content: "Eski çıkmış soruları satıyorum, ilgilenenler DM. Örnek kitap fotoğrafı ektedir.",
      author: "Caner D.",
      userImg: "https://ui-avatars.com/api/?name=Caner+D&background=dc2626&color=fff",
      postImg: "https://placehold.co/600x400/eeeeee/dc2626?text=Kitap+Fotografi",
      createdAt: "2026-05-02T09:15:00Z",
      reports: [
        { id: "rep_3", message: "Ticari satış yasak.", reporter: "Zeynep L." },
      ],
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bu postu tamamen silmek istediğine emin misin dostum?")) return;

    setIsLoading(true);
    try {
      setReportedPosts((prev) => prev.filter((post) => post.id !== postId));
      alert("Post başarıyla silindi!");
    } catch (error) {
      console.error(error);
      alert("Bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="feed admin-feed">
      <div className="border-b-2 border-red-600 dark:border-red-500 pb-4 mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
          Raporlanan Postlar
        </h1>
        <span className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 py-1 px-3 rounded-full font-medium">
          Toplam: {reportedPosts.length}
        </span>
      </div>

      <div className="posts-list">
        {reportedPosts.length === 0 ? (
          <div className="no-posts text-center py-10">
            Şu an için raporlanan bir post bulunmuyor. Temiz iş!
          </div>
        ) : (
          reportedPosts.map((post) => (
            <div key={post.id} className="post-preview border-l-4 border-red-600 dark:border-red-500 mb-6">
              
              <div className="post-header flex items-center gap-4 mb-3">
                {post.userImg && (
                  <img 
                    src={post.userImg} 
                    alt={post.author} 
                    className="w-12 h-12 rounded-full object-cover border border-red-200 dark:border-red-800"
                  />
                )}
                <div className="user-info flex justify-between w-full items-center">
                  <h3 className="font-semibold text-lg">{post.author}</h3>
                  <span className="text-sm opacity-70">
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
              </div>

              <div className="post-body mb-4">
                <p className="mb-3">{post.content}</p>
                {post.postImg && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={post.postImg} 
                      alt="Post görseli" 
                      className="w-full h-auto max-h-96 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="list-comments bg-red-50 dark:bg-red-900/10 p-4 rounded-md mt-4 border border-red-100 dark:border-red-900/30">
                <h4 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-3">
                  Rapor Detayları ({post.reports.length})
                </h4>
                {post.reports.map((report) => (
                  <div key={report.id} className="comment-preview flex flex-col border-b border-red-200 dark:border-red-800/50 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                    <span className="font-semibold text-red-700 dark:text-red-400">{report.reporter}:</span>
                    <span className="italic mt-1 opacity-90">"{report.message}"</span>
                  </div>
                ))}
              </div>

              <div className="post-actions flex justify-end gap-3 mt-4">
                <button 
                  className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => alert('Postu yoksayma özelliği eklenebilir.')}
                >
                  Raporu Yoksay
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Siliniyor..." : "Postu Sil"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}