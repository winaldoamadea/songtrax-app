import React from "react";


/**
 * header function 
 * 
 * @return {JSX.Element} - Returns a React component rendering the header.
 */

export default function Header() {
        
    return (
        <header class="page-header">
            <div class="header-logo">
                <h2>
                    <a href="/" class="header-icon-link">SongTrax</a>
                </h2>
            </div>
            <div class="header-app-description">
                <span>Create & Share Location Based Music Samples!</span>
            </div>
    </header>
    );

}