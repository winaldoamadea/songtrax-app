import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";

/**
 * react component for the header
 * 
 * @param {Object} props Properties passed to the component
 * @param {string} props.title The title of the page
 * @param {JSX.Element} props.children The children elements to be rendered
 * 
 * 
 * @return {JSX.Element} - Returns a React component for a template.
 */

function Template({ title, children }) {
    return (
        <>
            <Header></Header>
            <main>
                <h2>{title}</h2>
                {children}
            </main>
            <footer class="page-footer"></footer>
            
        </>

    );
}

Template.propTypes = {
    title: PropTypes.string.isRequired,
};

export default Template;