import { createContext, useContext, useState } from "react";

const FullscreenContext = createContext()
const FullscreenUpdateContet = createContext()

export const useFullscreenContext = () => {
    return useContext(FullscreenContext)
}

export const useFullscreenUpdateContext = () => {
    return useContext(FullscreenUpdateContet)
}

export const FullscreenProvider = ({children}) => {

    const [isFullscreen, setFullscreen] = useState(false)

    const toggleFullscreen = () => {
        setFullscreen(isFullscreen => !isFullscreen)
    }

    return (
        <FullscreenContext.Provider value={isFullscreen}>
            <FullscreenUpdateContet.Provider value={toggleFullscreen}>
                {children}
            </FullscreenUpdateContet.Provider>
        </FullscreenContext.Provider>
    )

}