import React, { useState } from 'react'
import '../Styles/navbar.css'
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaHome, FaRegTrashAlt } from 'react-icons/fa';
import { BsPencilFill, BsFillInfoCircleFill } from "react-icons/bs";
import { GiNewspaper } from "react-icons/gi";
import { BiNotepad } from "react-icons/bi";


import { NavLink } from "react-router-dom";

const routes = [
    {
        path: "/",
        name: "Home",
        icon: <FaHome />
    },
    {
        path: "/notes",
        name: "Notes",
        icon: <BsPencilFill />
    },
    {
        path: "/about",
        name: "About Us",
        icon: <BsFillInfoCircleFill />
    },
    {
        path: "/trash",
        name: "Trash",
        icon: <FaRegTrashAlt />
    },
    {
        path: "/resume",
        name: "Resume",
        icon: <BiNotepad />
    },
    {
        path: "/news",
        name: "News",
        icon: <GiNewspaper />
    }
]


function Navbar({ children }) {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    const anima = {
        hidden: {
            width: 0,
            opacity: 0,
            transition: {
                duration: 0.5,
            }
        },
        show: {
            width: "auto",
            opacity: 1,
            transition: {
                duration: 0.2,
            }
        }
    }

    return (
        <>
            <div className="head">
                <div id="menu">
                    <FaBars onClick={toggle} />
                </div>
                <div id="login">
                    <button>Log-in</button>
                </div>
            </div>
            <div id="logo">
                <h1>
                    CALLY
                </h1>
            </div>
            <motion.div animate={{
                width: isOpen ? "200px" : "60px", transition: {
                    duration: 0.5,
                    type: "spring",
                    damping: 20
                }
            }} className="sidebar">
                <section className='routes'>
                    {
                        routes.map((rout) => (
                            <NavLink
                                activeClassName="active"
                                to={rout.path}
                                key={rout.name}
                                className="link"
                            >
                                <div className="icon" >
                                    {rout.icon}
                                </div>
                                <AnimatePresence>
                                    {
                                        isOpen
                                        &&
                                        <motion.div

                                            variants={
                                                anima
                                            }
                                            initial="hidden"
                                            animate="show"
                                            exit="hidden"
                                            className="link_text"
                                        >
                                            {rout.name}
                                        </motion.div>
                                    }
                                </AnimatePresence>
                            </NavLink>
                        ))}
                </section>
            </motion.div>
            <main style={
                { left: isOpen ? "200px" : "60px" }
            }>
                {children}
            </main>

        </>
    )
}

export default Navbar