
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiImage, FiArrowRight } from 'react-icons/fi';
import publicProjectsService from '../../services/publicProjectsService';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  amount?: string;
  created_at: string;
  images?: any[];
  files?: any[];
  user?: {
    contact?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

const PublicProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await publicProjectsService.getPublicProjects();
      let projectsData = [];
      if (response.data && Array.isArray(response.data)) projectsData = response.data;
      else if (Array.isArray(response)) projectsData = response;
      else if (response.projects && Array.isArray(response.projects)) projectsData = response.projects;
      setProjects(projectsData);
    } catch (error: any) {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric', month: 'short', day: 'numeric',
    });


  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-Cprimary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-gray-400">Chargement des projets…</p>
        </div>
      </section>
    );
  }


  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

 
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-2xl font-semibold text-Cprimary uppercase tracking-widest mb-1">
              Opportunités
            </p>
            
          </div>
          <p className="text-sm text-gray-400 hidden sm:block">
            {projects.length} projet{projects.length > 1 ? 's' : ''} disponible{projects.length > 1 ? 's' : ''}
          </p>
        </div>

  
        {projects.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiImage className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">Aucun projet disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <article
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-Cprimary/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
         
                <div className="relative h-44 bg-gray-50 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0].url}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <FiImage className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

    
                  {project.status && (
                    <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-Csecondary1 shadow-sm backdrop-blur-sm">
                      {project.status}
                    </span>
                  )}

  
                  {project.images && project.images.length > 1 && (
                    <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                      +{project.images.length}
                    </span>
                  )}
                </div>


                <div className="p-5">

                  {project.amount && parseFloat(project.amount) > 0 && (
                    <p className="text-sm font-bold text-Cprimary mb-2">
                      {parseFloat(project.amount).toLocaleString('fr-FR')} FCFA
                    </p>
                  )}


                  <h3 className="text-base font-bold text-gray-900 truncate mb-1.5 group-hover:text-Cprimary transition-colors duration-200">
                    {project.name}
                  </h3>

 
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>


                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiUser className="w-3.5 h-3.5" />
                        {project.user?.contact?.firstName || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" />
                        {formatDate(project.created_at)}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 text-xs font-semibold text-Cprimary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Voir
                      <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicProjectsList;