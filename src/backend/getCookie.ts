"use client"

export default function getCookieValue (name: string): string {
    /*
    A function that gives a cookie with a given name

    Found on Stack Overflow
    https://stackoverflow.com/questions/5639346/what-is-the-shortest-function-for-reading-a-cookie-by-name-in-javascript
    */
    return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
}