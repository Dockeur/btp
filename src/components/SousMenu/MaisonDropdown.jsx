import React from "react";

const YourComponent = () => {
  const sections = [
    {
      id: "/login",
      title: "Section 1",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore earum natus vel minima quod error maxime, molestias ut. Fuga dignissimos nisi nemo necessitatibus quisquam obcaecati et reiciendis quaerat accusamus numquam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore earum natus vel minima quod error maxime, molestias ut. Fuga dignissimos nisi nemo necessitatibus quisquam obcaecati et reiciendis quaerat accusamus numquam.",
    },
    {
      id: "example-2",
      title: "Section 2",
      content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit...",
    },
    // ... other sections
  ];

  const Terrains = [
    {
      id: 1,
      title: "Terrains",
      descriptin:
        "  Ils sont des parcelles de terrain non développées, offrant aux acheteurs la possibilité de construire leur maison ou leur entreprise sur mesure.",
      image: "/src/assets/exploration/terrain.jpg ",
      alt: "image terrain",
      pageUrl: "/login",
    },
    {
      id: 2,
      title: "Villa",
      descriptin:
        "Elles sont des propriétés de luxe offrant un espace de vie spacieux et des équipements haut de gamme.",
      image: "/src/assets/exploration/villa.jpg",
      alt: "image villa",
      pageUrl: "/login",
    },
  ];

  return (
    <div className="grid grid-cols-4">
      <div className="col-span-3">
        <div
          data-te-spy="scroll"
          data-te-target="#scrollspy1"
          data-te-offset="200"
          className="relative h-80 overflow-auto"
        >
          <div className="px-4 lg:px-14 max-w-screen-2x1 mx-auto bg-neutralSilver w-screen  py-1 mt-0">
            <div className="grid lg:grid-cols-2 gap-2 mb-20 mt-3 items-center mr-60 ml-20">
              {Terrains.map((terrain) => (
                <div
                  key={terrain.id}
                  className="md:w-2/3 lg:w-[500px] lg:h-ful mx-auto bg-Csecondary1 rounded-2xl shadow-2xl mb-2 border border-Cprimary hover:scale-95 transition-all duration-300 -ml-20 w-[400px] lg:-ml-28"
                >
                  <div className="flex items-center gap-4">
                    <a href={terrain.pageUrl}>
                      <div className="relative">
                        <img
                          src={terrain.image}
                          alt={terrain.title}
                          className="h-[200px] w-[1000px] object-center rounded-md border border-Csecondary1 brightness-125 lg:-mb-0"
                        />
                      </div>
                    </a>
                    <div>
                      <h3 className="my-2 text-2xl font-poppins font-semibold text-white uppercase m-2">
                        {terrain.title}
                      </h3>
                      <p className="text-base font-serif text-texteCouleur text-justify m-2">
                        {terrain.descriptin}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div>
        <ScrollspyList sections={sections} />
      </div>
    </div>
  );
};

export default YourComponent;

const ScrollspySection = ({ id, title, content, subSections }) => (
  <section id={id}>
    <h3 className="pb-3 pt-5 text-xl font-semibold">{title}</h3>
    <p>{content}</p>
    {subSections && (
      <ul>
        {subSections.map((subSection) => (
          <li key={subSection.id}>
            <a href={`#${subSection.id}`}>{subSection.title}</a>
          </li>
        ))}
      </ul>
    )}
  </section>
);

const ScrollspyList = ({ sections }) => (
  <div id="scrollspy" className="sticky-top pl-3 text-sm">
    <ul>
      {sections.map((section) => (
        <li key={section.id} className="py-1">
          <a
            href={`${section.id}`}
            className="bg-neutralsylver px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
          >
            {section.title}
          </a>
          {section.subSections && (
            <ul className="pl-3">
              {section.subSections.map((subSection) => (
                <li key={subSection.id} className="py-1">
                  <a
                    href={`#${subSection.id}`}
                    className="bg-transparent px-[5px] text-neutral-600 shadow-none dark:text-neutral-200"
                  >
                    {subSection.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
    <div>
      <img
        src="/src/assets/exploration/duplex.jpg"
        className="h-52 w-52"
        alt=""
      />
    </div>
  </div>
);

// import React, { useState } from "react";
// import {
//   TETabs,
//   TETabsContent,
//   TETabsItem,
//   TETabsPane,
// } from "tw-elements-react";

// export default function TabsVertical() {
//   const [verticalActive, setVerticalActive] = useState("tab1");

//   const handleVerticalClick = (value) => {
//     if (value === verticalActive) {
//       return;
//     }
//     setVerticalActive(value);
//   };

//   return (
//     <div className="flex sm:fixed relative  flex-col items-start lg:-ml-5 lg:mt-10  overflow-y-auto max-h-96 lg:fixed border-x-2 bg-neutralSilver rounded-md  ">
//       <TETabs vertical >
//         <TETabsItem
//           onClick={() => handleVerticalClick("tab1")}
//           active={verticalActive === "tab1"}
//         > <a href="/login">Home</a>
//         </TETabsItem>

//         <TETabsItem
//           onClick={() => handleVerticalClick("tab2")}
//           active={verticalActive === "tab2"}
//         >
//          <a href="/contact"> Profile</a>
//         </TETabsItem>
//         <TETabsItem
//           onClick={() => handleVerticalClick("tab3")}
//           active={verticalActive === "tab3"}
//         >
//           Messages
//         </TETabsItem>
//         <TETabsItem
//           onClick={() => handleVerticalClick("tab4")}
//           active={verticalActive === "tab4"}
//           disabled
//         >
//           Contact
//         </TETabsItem>
//       </TETabs>

//       <TETabsContent className="px-7">
//         <TETabsPane show={verticalActive === "tab1"}>Tab 1 content</TETabsPane>
//         <TETabsPane show={verticalActive === "tab2"}>Tab 2 content</TETabsPane>
//         <TETabsPane show={verticalActive === "tab3"}>Tab 3 content</TETabsPane>
//         <TETabsPane show={verticalActive === "tab4"}>Tab 4 content</TETabsPane>
//       </TETabsContent>
//       <div class="flex items-center px-7">
//         <img src="/src/assets/exploration/villa.jpg" class="w-12 h-12 mr-4" alt="Image" />
//       </div>
//     </div>
//   );
// }

//import React from 'react';
// import ImageLogin from "@image/login.jpg"

// const Login = () => {
//   return (
//     <div className='w-full h-screen flex items-start'>
//       <div className='relative w-1/2 h-full flex flex-col'>
//         <div className='absolute top-[20%] left-[10%] flex flex-col'>
//           <h1 className='text-xl text-white font-bold my-4'>Transformez votre idia en réalité</h1>
//           <p className='text-xl text-white font-normal'>Commencez recevez ET gratuitement des offres attrayantes de la part de la communauté</p>

//         </div>
//         <img src={ImageLogin} alt="image de connexion" className='w-full h-full object-cover' />
//       </div>
//       <div className='w-1/2 h-full bg-Csecondary1 flex flex-col p-20 justify-between items-center'>
//         <h1 className='text-xl text-black font-semibold'>INTEEEEEEEE</h1>

//         <div className='w-full lex flex-col max-w-[450px]'>
//           <div className='w-full flex flex-col mb-2'>
//           <h3 className='text-3xl font-semibold mb-2'>Login</h3>
//           <p className='text-base mb-2'>Welcom, please entrer vous information de connexion</p>

//           </div>
//           <div className='w-full flex flex-col'>
//             <input
//             type="email"
//             placeholder='Email'
//             className='w-full text-black py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none' />

//               <input
//             type="password"
//             placeholder='password'
//             className='w-full text-black py-4 my-2 bg-transparent border-b border-black outline-none focus:outline-none' />

//           </div>
//           <div className='w-full flex items-center justify-between'>
//             <div className='w-full flex items-center' >
//               <input type="chechbox" className='w-4 h-4 mr-2' />
//               <p className='text-sm'>Remember me!</p>

//             </div>
//             <p className='text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2'>Forgot password ?</p>
//           </div>
//           <div className='w-full flex flex-col my-4'>
//             <button className='w-full text-white my-2 font-semibold bg-Cprimary rounded-md p-4 text-center justify-center'>
//               Login
//             </button>
//             <button className='w-full text-Cprimary my-2 font-semibold bg-Csecondary2 border-blue-400 rounded-md p-4 text-center justify-center'>
//               Register
//             </button>

//           </div>
//           <div className='w-full flex items-center justify-center py-2'>
//             <div className='w-full h-[1px] bg-Cprimary'></div>
//             <p className=' text-lg absolute  text-white '> or</p>

//           </div>

//           <div className='w-full text-Cprimary my-2 font-semibold bg-Csecondary2 border-blue-400 rounded-md p-4 text-center justify-center'>
//               Google
//             </div>

//         </div>

//         <div className='w-full flex items-center justify-center'>
//         <p className='text-sm font-normal text-black'>vous n'avez pas de compte? <span className='font-semibold underline-offset-2 cursor-pointer'>Sign up</span></p>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Login;

//import React from 'react';
// import SubMenu from './SubMenu';

// const MaisonDropdown = () => {
//     return (
//         <div>
//             <div className="relative group inline-block text-left ">
//                 <button className=" cursor-pointer text-base text-gray-900 hover:text-brandPrimary first:font-medium  divide-y md:flex  hidden ">
//                 Batiments
//                 </button>
//                 <div className="absolute hidden space-y-2 p-divide-y divide-gray-300 group-hover:block right-0 z-10 mt-0 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
//                 <SubMenu />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MaisonDropdown;
