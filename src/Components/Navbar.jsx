import React, { useContext } from 'react'
import { AppContext } from '../Context/AppContext'


const Navbar = () => {

  const { openModal, setopenModal,openMenu,setopenMenu} = useContext(AppContext);

  const handleclick = ()=>{
    setopenModal(!openModal)
  }
  return (
    <>
     <nav className={openMenu ? "showmenu":""}>
        <span>Virtual Assistrant</span>
       <div className="bottom">
       <ul>
        <li onClick={handleclick}><img src="images/writing.png" alt="" /><span>letter</span></li>
       </ul>
       </div>
     </nav> 
    </>
  )
}

export default Navbar
