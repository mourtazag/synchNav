import { throttle } from "./utils.js";
import scrollIt from "./scrollIt.js";

export default function synchNav(links, fromTop, callback) {

    const linkList = links;
    const sections = Array.from(linkList).map(function (link) {

        const section = document.querySelector(link.getAttribute("href"));
        if (section) return section;

    });

    synchLinksToSections();
    window.addEventListener("scroll", throttle(synchLinksToSections, 150));

    function synchLinksToSections() {

        const fromTop = 150;

        let activeSections = sections.map(function (section) {

            if (section.getBoundingClientRect().top < fromTop) return section;

        }).filter(function (section) {
            return section !== undefined;
        });

        const currentSection = activeSections[activeSections.length - 1];
        let currentLink;


        if (currentSection) {

            currentLink = document.querySelector("a[href='#" + currentSection.getAttribute("id") + "']");

            if (callback && typeof callback === "function") callback(currentLink, currentSection, linkList);
        }


    }

    Array.from(linkList).forEach(function (link) {
        link.addEventListener("click", scrollToTarget);
    });

    function scrollToTarget(e) {
        if (scrollIt) {
            e.preventDefault();
            const targetTop = window.pageYOffset + document.querySelector(e.target.getAttribute("href")).getBoundingClientRect().top;
            scrollIt(targetTop, 400, "linear");
        }

    }

}
