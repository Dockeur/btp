import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiCalendar, FiUser, FiFileText,
  FiX, FiImage, FiFile, FiDownload, FiPhone, FiMail
} from 'react-icons/fi';
import publicProjectsService from '../../services/publicProjectsService';

interface ProjectImage { id: number; url: string; }
interface ProjectFile  { id: number; filename: string; url: string; }
interface UserContact  { firstName?: string; lastName?: string; email?: string; phoneNumber?: string; }
interface ProjectUser  { id?: number; contact?: UserContact; }
interface Project {
  id: number; name: string; description: string; uuid: string;
  status: string; amount?: string; created_at: string;
  images?: ProjectImage[]; files?: ProjectFile[]; user?: ProjectUser;
}

const statusConfig: Record<string, { label: string; dot: string; text: string }> = {
  published:   { label: 'Publié',      dot: 'bg-green-500',  text: 'text-green-700'  },
  unpublished: { label: 'Non publié',  dot: 'bg-gray-400',   text: 'text-gray-600'   },
  completed:   { label: 'Terminé',     dot: 'bg-blue-500',   text: 'text-blue-700'   },
  in_progress: { label: 'En cours',    dot: 'bg-yellow-500', text: 'text-yellow-700' },
};

const PublicProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject]         = useState<Project | null>(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeImg, setActiveImg]     = useState(0);

  useEffect(() => { if (id) fetchProject(id); }, [id]);

  const fetchProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      const response = await publicProjectsService.getPublicProject(projectId);
      setProject(response.data || response);
    } catch {
      setTimeout(() => navigate('/projects'), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const getExt = (filename: string) => filename.split('.').pop()?.toUpperCase() || 'FILE';

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

 
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-Cprimary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Chargement du projet…</p>
        </div>
      </div>
    );
  }

 
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-6">Projet non trouvé</p>
          <button onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-Cprimary text-white text-sm font-semibold rounded-xl">
            <FiArrowLeft className="w-4 h-4" /> Retour
          </button>
        </div>
      </div>
    );
  }

  const status = statusConfig[project.status] || { label: project.status, dot: 'bg-gray-400', text: 'text-gray-600' };
  const images = project.images || [];
  const files  = project.files  || [];

  return (
    <div className="min-h-screen bg-gray-50">

    
      <div className="bg-Cprimary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

        
          <button onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-6 transition-colors">
            <FiArrowLeft className="w-4 h-4" /> Retour aux projets
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
   
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                  {status.label}
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white leading-tight">
                {project.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/50">
                <span className="flex items-center gap-1.5">
                  <FiUser className="w-3.5 h-3.5" />
                  {project.user?.contact?.firstName || 'N/A'} {project.user?.contact?.lastName || ''}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5" />
                  {formatDate(project.created_at)}
                </span>
              </div>
            </div>

            {project.amount && parseFloat(project.amount) > 0 && (
              <div className="bg-white/10 border border-white/15 rounded-2xl px-6 py-4 backdrop-blur-sm shrink-0">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Montant</p>
                <p className="text-2xl font-black text-white">
                  {parseFloat(project.amount).toLocaleString('fr-FR')}
                  <span className="text-sm font-medium text-white/60 ml-1">FCFA</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


          <div className="lg:col-span-2 space-y-6">

            {images.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

                <div
                  className="relative h-72 lg:h-96 cursor-zoom-in overflow-hidden"
                  onClick={() => setSelectedImage(images[activeImg].url)}
                >
                  <img
                    src={images[activeImg].url}
                    alt="Image principale"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute bottom-4 right-4 text-xs text-white/80 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {activeImg + 1} / {images.length}
                  </span>
                </div>


                {images.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImg(i)}
                        className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                          activeImg === i ? 'border-Cprimary' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}


            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                {project.description}
              </p>
            </div>


            {files.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Fichiers joints
                  <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium normal-case">
                    {files.length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id}
                      className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:border-Cprimary/30 transition-all duration-200 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-Cprimary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-Cprimary">{getExt(file.filename)}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700 truncate">{file.filename}</p>
                      </div>
                      <button
                        onClick={() => handleDownload(file.url, file.filename)}
                        className="shrink-0 ml-3 flex items-center gap-1.5 text-xs font-semibold text-Cprimary hover:text-Csecondary1 transition-colors px-3 py-1.5 rounded-lg hover:bg-Cprimary/10"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Télécharger</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {images.length === 0 && files.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiFileText className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">Aucun fichier ou image associé à ce projet</p>
              </div>
            )}
          </div>


          <div className="space-y-4">


            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Créateur du projet
              </h3>


              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-Cprimary/10 flex items-center justify-center shrink-0">
                  <FiUser className="w-5 h-5 text-Cprimary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {project.user?.contact?.firstName || 'N/A'} {project.user?.contact?.lastName || ''}
                  </p>
                  <p className="text-xs text-gray-400">Propriétaire</p>
                </div>
              </div>

              <div className="space-y-3">
                {project.user?.contact?.email && (
                  <a href={`mailto:${project.user.contact.email}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-Cprimary/10 flex items-center justify-center shrink-0 transition-colors">
                      <FiMail className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{project.user.contact.email}</span>
                  </a>
                )}
                {project.user?.contact?.phoneNumber && (
                  <a href={`tel:${project.user.contact.phoneNumber}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-Cprimary transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-Cprimary/10 flex items-center justify-center shrink-0 transition-colors">
                      <FiPhone className="w-3.5 h-3.5" />
                    </div>
                    <span>{project.user.contact.phoneNumber}</span>
                  </a>
                )}
              </div>
            </div>


            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Résumé
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <FiImage className="w-4 h-4" />, label: 'Images',   value: images.length, color: 'text-purple-500' },
                  { icon: <FiFile  className="w-4 h-4" />, label: 'Fichiers', value: files.length,  color: 'text-green-500'  },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className={`flex items-center gap-2 text-sm text-gray-500 ${stat.color}`}>
                      {stat.icon}
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-600">Publié le</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{formatDate(project.created_at)}</span>
                </div>
              </div>
            </div>


            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-Cprimary hover:bg-Csecondary1 text-white font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Contacter à propos de ce projet
            </button>
          </div>
        </div>
      </div>


      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Agrandie"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default PublicProjectDetails;