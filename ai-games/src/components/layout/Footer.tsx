'use client';

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full border-t border-gray-200 bg-white py-4"
        >
            <div className="container mx-auto px-4 flex flex-col justify-between items-center space-y-4">
                <span className="text-gray-500 text-xs">
                    © {new Date().getFullYear()} Sadiqul Islam Shakib. All rights reserved.
                </span>

                <div className="mt-2 sm:mt-0 flex space-x-6">
                    {[
                        {
                            href: "https://github.com/ByteCrister",
                            icon: FaGithub,
                            label: "GitHub",
                            delay: 0.8,
                        },
                        {
                            href: "https://www.linkedin.com/in/sadiqul-islam-shakib-9a539628a/",
                            icon: FaLinkedin,
                            label: "LinkedIn",
                            delay: 0.9,
                        },
                    ].map(({ href, icon: Icon, label, delay }) => (
                        <motion.a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay }}
                            whileHover={{ scale: 1.2, color: "#2563EB" }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <Icon size={20} />
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.footer>
    )
}

export default Footer