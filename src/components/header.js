import React from "react";
import "./header.css";

const Header = () =>
{
    return(
        <header>
            <ul className="logo">
                <li>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/232px-Spotify_icon.svg.png" alt="" />
                    <a href="/">SpofleX</a>
                </li>
            </ul>
        </header>
    );
}


export default Header;