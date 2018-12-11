import { throttle } from "./utils.js";
import scrollIt from "./scrollIt.js";

export default 
function synchNav(links, options) {

    let triggerChangePosition;
    if(options.positionTopTrigger && typeof options.positionTopTrigger === "number") {
        triggerChangePosition = options.positionTopTrigger;
    } else {
        triggerChangePosition = 150;
    }

    let scrollToPosition;
    if(options.scrollToFromTrop && typeof options.scrollToFromTrop === "number") {
        scrollToPosition = options.scrollToFromTrop;
    } else {
        scrollToPosition = 0;
    }

    let callback;
    if(options.callback && typeof options.callback === "function") {
        callback = options.callback;
    }

    const linkList = links;
    const sections = Array.from(linkList).map(function (link) {

        const section = document.querySelector(link.getAttribute("href"));
        if (section) return section;

    })

    synchLinksToSections();
    window.addEventListener("scroll", throttle(synchLinksToSections, 150));

    function synchLinksToSections() {

        const fromTop = triggerChangePosition;

        let activeSections = sections.map(function (section) {

            if (section.getBoundingClientRect().top < fromTop) return section;

        }).filter(function (section) {
            return section !== undefined;
        })

        const currentSection = activeSections[activeSections.length - 1];
        let currentLink;


        if (currentSection) {

            currentLink = document.querySelector("a[href='#" + currentSection.getAttribute("id") + "']");

            if (callback && typeof callback === "function") callback(currentLink, currentSection, linkList);
        }


    }

    Array.from(linkList).forEach(function (link) {
        link.addEventListener("click", scrollToTarget);
    })

    function scrollToTarget(e) {
        if (scrollIt) {
            e.preventDefault();
            const targetTop = window.pageYOffset + document.querySelector(e.target.closest("a").getAttribute("href")).getBoundingClientRect().top + scrollToPosition;
            scrollIt(targetTop, 400, "linear");
        }

    }

}
