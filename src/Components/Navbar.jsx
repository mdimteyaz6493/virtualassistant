import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'


const Navbar = () => {

  const { openModal, setopenModal,openMenu,setopenMenu} = useContext(AppContext);

  const handleClick = () => {
    setTimeout(() => {
      setopenModal(false);
      setopenMenu(false);
    }, 1000); // 2000 milliseconds = 2 seconds
  };
  
  const handleClick2 = () => {
    setTimeout(() => {
      setopenModal(true);
      setopenMenu(false);
    }, 500); // 2000 milliseconds = 2 seconds
  };
  
  return (
    <>
     <nav className={openMenu ? "showmenu":""}>
        <span>Virtual Assistrant</span>
       <div className="bottom">
       <ul>
        <li onClick={handleClick}><img src="images/microphone.png" alt="" /><span>Voice Assistant</span></li>
        <li onClick={handleClick2}><img src="images/image.png" alt="" /><span>Image Search</span></li>
       </ul>
       </div>
     </nav> 
    </>
  )
}

export default Navbar
