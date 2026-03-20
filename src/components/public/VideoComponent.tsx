// import React from 'react';
// import ReactPlayer from 'react-player';

// // 1. Définition de l'interface pour les props
// interface VideoComponentProps {
//     videoUrlFromBackend: string;
// }

// // 2. Utilisation de React.FC (Functional Component) avec l'interface
// const VideoComponent: React.FC<VideoComponentProps> = ({ videoUrlFromBackend }) => {
//     return (
//         <div className='player-wrapper' style={{ position: 'relative', paddingTop: '56.25%' }}>
//             <ReactPlayer
//                 url={videoUrlFromBackend}
//                 controls={true}
//                 width='100%'
//                 height='100%'
//                 config={{
//                     youtube: {
//                         // On ne met PAS de "playerVars" ici
//                         // On met les propriétés directement :
//                         embedOptions: {
//                             // Si tu as besoin d'options d'intégration spécifiques
//                         }
//                         // Note : showinfo est déprécié par YouTube, 
//                         // mais voici comment passer des paramètres d'URL :
//                     },
//                     facebook: {
//                         appId: '12345'
//                     }
//                 }}
//             />
//         </div>
//     );
// };

// export default VideoComponent;