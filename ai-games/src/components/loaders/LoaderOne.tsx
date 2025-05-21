"use client";

import React from 'react'
import styles from '@/components/loaders/loader-one.module.css'

const LoaderOne = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className={styles.loader}></div>
        </div>
    )
}

export default LoaderOne