import StackCrash3D from "../images/StackCrash3D.jpg";
import ColorPuzzle from "../images/ColorPuzzle.jpg";
import ShadowFighter from "../images/ShadowFighter.jpg";
import BlockPixels from "../images/Block.Pixels.jpg";
import GrassLand from "../images/GrassLand.jpg";

export const games = [
    {
        slug: "stack-crash-3d",
        name: "Stack Crash 3D",
        image: StackCrash3D,
        iframeSrc:
            "https://html5.gamedistribution.com/0df98c9ecda34b36a0a60a4f1776bc7c/?gd_sdk_referrer_url=https://www.example.com/games/stack-crash-3d",
    },
    {
        slug: "color-puzzle",
        name: "Color Puzzle",
        image: ColorPuzzle,
        iframeSrc:
            "https://html5.gamedistribution.com/a8870b5a6a76492db5cb8ca599f64843/?gd_sdk_referrer_url=https://www.example.com/games/color-puzzle",
    },
    {
        slug: "Shadow Fighter",
        name: "Shadow Fighter",
        image: ShadowFighter,
        iframeSrc:
            "https://html5.gamedistribution.com/b85c51b601a04c7eb0dcace46e649084/?gd_sdk_referrer_url=https://www.example.com/games/Shadow-Fighter",
    },
    {
        slug: "Block Pixels",
        name: "Block Pixels",
        image: BlockPixels,
        iframeSrc:
            "https://html5.gamedistribution.com/60243f5a5a994dd8ba4030b11f0a41a9/?gd_sdk_referrer_url=https://www.example.com/games/Block-Pixels",
    },
    {
        slug: "Grass Land",
        name: "Grass Land",
        image: GrassLand,
        iframeSrc:
            "https://html5.gamedistribution.com/265715cb6c0344e19716900ca42eca18/?gd_sdk_referrer_url=https://www.example.com/games/Grass-Land",
    },
];

export const getGameBySlug = (slug) => games.find((g) => g.slug === slug); 