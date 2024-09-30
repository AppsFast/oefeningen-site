document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sideMenu = document.querySelector('.side-menu');
    const menuItems = document.querySelectorAll('.side-menu li');
    const categoryTitle = document.getElementById('category-title');
    const exerciseText = document.getElementById('exercise-text');
    const exerciseContainer = document.getElementById('exercise-container');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const colorPicker = document.getElementById('color-picker');
    const rgbButton = document.querySelector('.rgb-button');
    const resetButton = document.getElementById('reset-button');
    const languageSelector = document.getElementById('language-selector');
    const progressBar = document.getElementById('progress-bar');
    const proximityThreshold = 30;

    
    const aboutMeBtn = document.getElementById('about-me-btn');
    const aboutMeOverlay = document.getElementById('about-me-overlay');
    const contactMeBtn = document.getElementById('contact-me-btn');
    const contactOverlay = document.getElementById('contact-overlay');
    const closeAboutOverlayBtn = document.getElementById('close-about-overlay');
    const closeContactOverlayBtn = document.getElementById('close-contact-overlay');
    
    const copyEmailBtn = document.getElementById('copy-email');

    aboutMeBtn.addEventListener('click', () => {
        aboutMeOverlay.classList.add('show');
    });
    
    contactMeBtn.addEventListener('click', () => {
        contactOverlay.classList.add('show');
    });

    closeAboutOverlayBtn.addEventListener('click', () => {
        aboutMeOverlay.classList.remove('show');
    });

    closeContactOverlayBtn.addEventListener('click', () => {
        contactOverlay.classList.remove('show');
    });
        
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });
    });    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (aboutMeOverlay.classList.contains('show')) {
                aboutMeOverlay.classList.remove('show');
            } else if (contactOverlay.classList.contains('show')) {
                contactOverlay.classList.remove('show');
            }
        }
    });

    copyEmailBtn.addEventListener('click', () => {
        const email = document.getElementById('email').textContent;
        navigator.clipboard.writeText(email).then(() => {
            alert('E-mail gekopieerd: ' + email);
        }).catch(err => {
            console.error('Kan e-mail niet kopiëren: ', err);
        });
    });


    
  

    let isMenuOpen = false;
    let currentCategory = 'Machten';
    let exercises = [];
    let currentExerciseIndex = 0;
    let feedbackTimeout;
    let score = 0;

    const allExercises = {
        "Machten": [
            { question: "4<sup>2</sup>", options: ["16", "12", "18", "14"], answer: "16" },
            { question: "2<sup>3</sup>", options: ["8", "6", "9", "7"], answer: "8" },
            { question: "3<sup>2</sup>", options: ["9", "12", "6", "15"], answer: "9" },
            { question: "5<sup>2</sup>", options: ["25", "30", "20", "35"], answer: "25" },
            { question: "2<sup>4</sup>", options: ["16", "8", "12", "10"], answer: "16" },
            { question: "6<sup>2</sup>", options: ["36", "42", "30", "26"], answer: "36" },
            { question: "7<sup>2</sup>", options: ["49", "47", "45", "50"], answer: "49" },
            { question: "10<sup>3</sup>", options: ["1000", "100", "10", "10000"], answer: "1000" },
            { question: "3<sup>3</sup>", options: ["27", "18", "9", "36"], answer: "27" },
            { question: "4<sup>3</sup>", options: ["64", "32", "16", "48"], answer: "64" },
            { question: "9<sup>2</sup>", options: ["81", "72", "90", "75"], answer: "81" },
            { question: "8<sup>2</sup>", options: ["64", "72", "48", "54"], answer: "64" },
            { question: "5<sup>3</sup>", options: ["125", "150", "100", "175"], answer: "125" },
            { question: "6<sup>3</sup>", options: ["216", "186", "256", "196"], answer: "216" },
            { question: "7<sup>3</sup>", options: ["343", "333", "353", "323"], answer: "343" },
            { question: "11<sup>2</sup>", options: ["121", "111", "131", "141"], answer: "121" },
            { question: "12<sup>2</sup>", options: ["144", "154", "134", "164"], answer: "144" },
            { question: "15<sup>2</sup>", options: ["225", "235", "215", "205"], answer: "225" },
            { question: "13<sup>2</sup>", options: ["169", "149", "179", "189"], answer: "169" },
            { question: "14<sup>2</sup>", options: ["196", "176", "216", "186"], answer: "196" },
            { question: "2<sup>5</sup>", options: ["32", "16", "24", "64"], answer: "32" },
            { question: "3<sup>4</sup>", options: ["81", "64", "48", "72"], answer: "81" },
            { question: "4<sup>4</sup>", options: ["256", "144", "196", "324"], answer: "256" },
            { question: "5<sup>4</sup>", options: ["625", "525", "725", "825"], answer: "625" },
            { question: "6<sup>4</sup>", options: ["1296", "1024", "1156", "1444"], answer: "1296" },
            { question: "7<sup>4</sup>", options: ["2401", "2500", "2304", "2025"], answer: "2401" },
            { question: "8<sup>4</sup>", options: ["4096", "3024", "3244", "3721"], answer: "4096" },
            { question: "9<sup>3</sup>", options: ["729", "486", "512", "625"], answer: "729" },
            { question: "10<sup>4</sup>", options: ["10000", "1000", "100", "100000"], answer: "10000" },
            { question: "5<sup>0</sup>", options: ["1", "0", "5", "∞"], answer: "1" }
        ],
        "Vergelijkingen": [
            { question: "3x + 5 = 11", options: ["x = 2", "x = 3", "x = 4", "x = 5"], answer: "x = 2" },
            { question: "2x - 4 = 6", options: ["x = 5", "x = 4", "x = 3", "x = 6"], answer: "x = 5" },
            { question: "4x + 2 = 10", options: ["x = 2", "x = 1", "x = 3", "x = 4"], answer: "x = 2" },
            { question: "5x - 3 = 12", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
            { question: "6x + 4 = 28", options: ["x = 4", "x = 3", "x = 5", "x = 2"], answer: "x = 4" },
            { question: "7x - 5 = 16", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
            { question: "8x + 6 = 30", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
            { question: "9x - 7 = 20", options: ["x = 3", "x = 2", "x = 4", "x = 5"], answer: "x = 3" },
            { question: "10x + 8 = 48", options: ["x = 4", "x = 5", "x = 6", "x = 7"], answer: "x = 4" },
            { question: "11x - 9 = 32", options: ["x = 4", "x = 5", "x = 6", "x = 7"], answer: "x = 4" },
            { question: "12x + 10 = 70", options: ["x = 5", "x = 4", "x = 6", "x = 7"], answer: "x = 5" },
            { question: "13x - 11 = 52", options: ["x = 5", "x = 4", "x = 6", "x = 7"], answer: "x = 5" },
            { question: "14x + 12 = 84", options: ["x = 6", "x = 5", "x = 7", "x = 8"], answer: "x = 6" },
            { question: "15x - 13 = 77", options: ["x = 6", "x = 5", "x = 7", "x = 8"], answer: "x = 6" },
            { question: "16x + 14 = 110", options: ["x = 6", "x = 7", "x = 5", "x = 8"], answer: "x = 6" },
            { question: "17x - 15 = 103", options: ["x = 7", "x = 6", "x = 5", "x = 8"], answer: "x = 7" },
            { question: "18x + 16 = 142", options: ["x = 7", "x = 6", "x = 5", "x = 8"], answer: "x = 7" },
            { question: "19x - 17 = 145", options: ["x = 7", "x = 6", "x = 8", "x = 5"], answer: "x = 7" },
            { question: "20x + 18 = 158", options: ["x = 7", "x = 6", "x = 8", "x = 5"], answer: "x = 7" },
            { question: "21x - 19 = 160", options: ["x = 8", "x = 7", "x = 6", "x = 9"], answer: "x = 8" },
            { question: "22x + 20 = 196", options: ["x = 8", "x = 9", "x = 7", "x = 10"], answer: "x = 8" },
            { question: "23x - 21 = 187", options: ["x = 9", "x = 8", "x = 10", "x = 7"], answer: "x = 9" },
            { question: "24x + 22 = 230", options: ["x = 9", "x = 8", "x = 10", "x = 7"], answer: "x = 9" },
            { question: "25x - 23 = 202", options: ["x = 9", "x = 8", "x = 10", "x = 7"], answer: "x = 9" },
            { question: "26x + 24 = 258", options: ["x = 9", "x = 10", "x = 11", "x = 12"], answer: "x = 9" },
            { question: "27x - 25 = 228", options: ["x = 9", "x = 10", "x = 11", "x = 12"], answer: "x = 9" },
            { question: "28x + 26 = 282", options: ["x = 10", "x = 9", "x = 11", "x = 12"], answer: "x = 10" },
            { question: "29x - 27 = 244", options: ["x = 10", "x = 11", "x = 9", "x = 12"], answer: "x = 10" },
            { question: "30x + 28 = 328", options: ["x = 10", "x = 11", "x = 9", "x = 12"], answer: "x = 10" }
        ],
        "Ongelijkheden": [
            { question: "x - 3 > 2", options: ["x > 5", "x > 1", "x > 3", "x > 2"], answer: "x > 5" },
            { question: "2x + 1 ≥ 3", options: ["x ≥ 1", "x ≥ 0", "x ≥ 2", "x ≥ -1"], answer: "x ≥ 1" },
            { question: "x/2 + 3 ≤ 5", options: ["x ≤ 4", "x ≤ 2", "x ≤ 1", "x ≤ 0"], answer: "x ≤ 4" },
            { question: "4x - 7 < 5", options: ["x < 3", "x < 2", "x < 4", "x < 5"], answer: "x < 3" },
            { question: "5x + 3 > 18", options: ["x > 3", "x > 4", "x > 2", "x > 5"], answer: "x > 3" },
            { question: "3x - 2 ≤ 10", options: ["x ≤ 4", "x ≤ 5", "x ≤ 3", "x ≤ 2"], answer: "x ≤ 4" },
            { question: "6x + 5 ≥ 17", options: ["x ≥ 2", "x ≥ 3", "x ≥ 4", "x ≥ 1"], answer: "x ≥ 2" },
            { question: "7x - 8 < 20", options: ["x < 4", "x < 5", "x < 6", "x < 3"], answer: "x < 4" },
            { question: "8x + 7 > 31", options: ["x > 3", "x > 2", "x > 4", "x > 5"], answer: "x > 3" },
            { question: "9x - 4 ≤ 23", options: ["x ≤ 3", "x ≤ 4", "x ≤ 5", "x ≤ 2"], answer: "x ≤ 3" },
            { question: "10x + 6 ≥ 46", options: ["x ≥ 4", "x ≥ 3", "x ≥ 5", "x ≥ 6"], answer: "x ≥ 4" },
            { question: "11x - 9 < 32", options: ["x < 3", "x < 2", "x < 4", "x < 5"], answer: "x < 3" },
            { question: "12x + 8 > 44", options: ["x > 3", "x > 2", "x > 4", "x > 5"], answer: "x > 3" },
            { question: "13x - 5 ≤ 35", options: ["x ≤ 3", "x ≤ 4", "x ≤ 5", "x ≤ 2"], answer: "x ≤ 3" },
            { question: "14x + 9 ≥ 79", options: ["x ≥ 5", "x ≥ 4", "x ≥ 6", "x ≥ 3"], answer: "x ≥ 5" },
            { question: "15x - 6 < 69", options: ["x < 5", "x < 4", "x < 6", "x < 7"], answer: "x < 5" },
            { question: "16x + 10 > 130", options: ["x > 7", "x > 6", "x > 5", "x > 8"], answer: "x > 7" },
            { question: "17x - 11 ≤ 74", options: ["x ≤ 5", "x ≤ 4", "x ≤ 6", "x ≤ 7"], answer: "x ≤ 5" },
            { question: "18x + 12 ≥ 102", options: ["x ≥ 5", "x ≥ 6", "x ≥ 4", "x ≥ 7"], answer: "x ≥ 5" },
            { question: "19x - 13 < 72", options: ["x < 5", "x < 4", "x < 6", "x < 3"], answer: "x < 5" },
            { question: "20x + 14 > 94", options: ["x > 4", "x > 5", "x > 3", "x > 6"], answer: "x > 4" },
            { question: "21x - 15 ≤ 126", options: ["x ≤ 6", "x ≤ 5", "x ≤ 7", "x ≤ 4"], answer: "x ≤ 6" },
            { question: "22x + 16 ≥ 150", options: ["x ≥ 6", "x ≥ 5", "x ≥ 7", "x ≥ 4"], answer: "x ≥ 6" },
            { question: "23x - 17 < 120", options: ["x < 6", "x < 5", "x < 7", "x < 8"], answer: "x < 6" },
            { question: "24x + 18 > 186", options: ["x > 7", "x > 6", "x > 8", "x > 9"], answer: "x > 7" },
            { question: "25x - 19 ≤ 130", options: ["x ≤ 5", "x ≤ 4", "x ≤ 6", "x ≤ 7"], answer: "x ≤ 5" },
            { question: "26x + 20 ≥ 176", options: ["x ≥ 6", "x ≥ 5", "x ≥ 7", "x ≥ 8"], answer: "x ≥ 6" },
            { question: "27x - 21 < 132", options: ["x < 5", "x < 4", "x < 6", "x < 7"], answer: "x < 5" },
            { question: "28x + 22 > 234", options: ["x > 7", "x > 6", "x > 8", "x > 9"], answer: "x > 7" }
        ],
        "Merkwaardige producten": [
            { question: "(a + b)<sup>2</sup>", options: ["a<sup>2</sup> + 2ab + b<sup>2</sup>", "a<sup>2</sup> + ab + b<sup>2</sup>", "a<sup>2</sup> + ab", "a + b"], answer: "a<sup>2</sup> + 2ab + b<sup>2</sup>" },
            { question: "(a - b)<sup>2</sup>", options: ["a<sup>2</sup> - 2ab + b<sup>2</sup>", "a<sup>2</sup> - ab + b<sup>2</sup>", "a - b", "a<sup>2</sup> - ab"], answer: "a<sup>2</sup> - 2ab + b<sup>2</sup>" },
            { question: "(a + b)(a - b)", options: ["a<sup>2</sup> - b<sup>2</sup>", "a<sup>2</sup> + ab", "a + b", "ab - b<sup>2</sup>"], answer: "a<sup>2</sup> - b<sup>2</sup>" },
            { question: "(x + y)<sup>2</sup>", options: ["x<sup>2</sup> + 2xy + y<sup>2</sup>", "x<sup>2</sup> + xy + y<sup>2</sup>", "x + y", "x<sup>2</sup> - y<sup>2</sup>"], answer: "x<sup>2</sup> + 2xy + y<sup>2</sup>" },
            { question: "(x - y)<sup>2</sup>", options: ["x<sup>2</sup> - 2xy + y<sup>2</sup>", "x<sup>2</sup> - xy + y<sup>2</sup>", "x<sup>2</sup> - y<sup>2</sup>", "x - y"], answer: "x<sup>2</sup> - 2xy + y<sup>2</sup>" },
            { question: "(x + y)(x - y)", options: ["x<sup>2</sup> - y<sup>2</sup>", "x + y", "xy - y<sup>2</sup>", "x<sup>2</sup> + xy"], answer: "x<sup>2</sup> - y<sup>2</sup>" },
            { question: "(x + 2)<sup>2</sup>", options: ["x<sup>2</sup> + 4x + 4", "x<sup>2</sup> + 2x + 4", "x<sup>2</sup> + 2", "x<sup>2</sup> + 4"], answer: "x<sup>2</sup> + 4x + 4" },
            { question: "(x - 3)<sup>2</sup>", options: ["x<sup>2</sup> - 6x + 9", "x<sup>2</sup> - 3x + 9", "x<sup>2</sup> - 6", "x<sup>2</sup> - 3"], answer: "x<sup>2</sup> - 6x + 9" },
            { question: "(x + 4)(x - 4)", options: ["x<sup>2</sup> - 16", "x<sup>2</sup> + 16", "x<sup>2</sup> + 4", "x<sup>2</sup> - 4"], answer: "x<sup>2</sup> - 16" },
            { question: "(2x + 1)<sup>2</sup>", options: ["4x<sup>2</sup> + 4x + 1", "4x<sup>2</sup> + 1", "4x<sup>2</sup> + 2x + 1", "4x<sup>2</sup> + 4"], answer: "4x<sup>2</sup> + 4x + 1" },
            { question: "(3x - 2)<sup>2</sup>", options: ["9x<sup>2</sup> - 12x + 4", "9x<sup>2</sup> - 4", "9x<sup>2</sup> - 6x + 4", "9x<sup>2</sup> - 12"], answer: "9x<sup>2</sup> - 12x + 4" },
            { question: "(x + 5)(x - 5)", options: ["x<sup>2</sup> - 25", "x<sup>2</sup> + 5", "x<sup>2</sup> + 25", "x + 5"], answer: "x<sup>2</sup> - 25" },
            { question: "(x + 6)<sup>2</sup>", options: ["x<sup>2</sup> + 12x + 36", "x<sup>2</sup> + 6x + 36", "x<sup>2</sup> + 12", "x<sup>2</sup> + 6"], answer: "x<sup>2</sup> + 12x + 36" },
            { question: "(x - 7)<sup>2</sup>", options: ["x<sup>2</sup> - 14x + 49", "x<sup>2</sup> - 7x + 49", "x<sup>2</sup> - 14", "x<sup>2</sup> - 7"], answer: "x<sup>2</sup> - 14x + 49" },
            { question: "(x + 8)(x - 8)", options: ["x<sup>2</sup> - 64", "x<sup>2</sup> + 64", "x<sup>2</sup> + 8", "x<sup>2</sup> - 8"], answer: "x<sup>2</sup> - 64" },
            { question: "(2x + 3)<sup>2</sup>", options: ["4x<sup>2</sup> + 12x + 9", "4x<sup>2</sup> + 3x + 9", "4x<sup>2</sup> + 9", "4x<sup>2</sup> + 12"], answer: "4x<sup>2</sup> + 12x + 9" },
            { question: "(3x - 4)<sup>2</sup>", options: ["9x<sup>2</sup> - 24x + 16", "9x<sup>2</sup> - 4x + 16", "9x<sup>2</sup> - 24", "9x<sup>2</sup> - 4"], answer: "9x<sup>2</sup> - 24x + 16" },
            { question: "(x + 9)<sup>2</sup>", options: ["x<sup>2</sup> + 18x + 81", "x<sup>2</sup> + 9x + 81", "x<sup>2</sup> + 18", "x<sup>2</sup> + 9"], answer: "x<sup>2</sup> + 18x + 81" },
            { question: "(x - 10)<sup>2</sup>", options: ["x<sup>2</sup> - 20x + 100", "x<sup>2</sup> - 10x + 100", "x<sup>2</sup> - 20", "x<sup>2</sup> - 10"], answer: "x<sup>2</sup> - 20x + 100" },
            { question: "(x + 11)(x - 11)", options: ["x<sup>2</sup> - 121", "x<sup>2</sup> + 11", "x<sup>2</sup> + 121", "x + 11"], answer: "x<sup>2</sup> - 121" },
            { question: "(x + 12)<sup>2</sup>", options: ["x<sup>2</sup> + 24x + 144", "x<sup>2</sup> + 12x + 144", "x<sup>2</sup> + 24", "x<sup>2</sup> + 12"], answer: "x<sup>2</sup> + 24x + 144" },
            { question: "(x - 13)<sup>2</sup>", options: ["x<sup>2</sup> - 26x + 169", "x<sup>2</sup> - 13x + 169", "x<sup>2</sup> - 26", "x<sup>2</sup> - 13"], answer: "x<sup>2</sup> - 26x + 169" },
            { question: "(x + 14)(x - 14)", options: ["x<sup>2</sup> - 196", "x<sup>2</sup> + 14", "x<sup>2</sup> + 196", "x + 14"], answer: "x<sup>2</sup> - 196" },
            { question: "(x + 15)<sup>2</sup>", options: ["x<sup>2</sup> + 30x + 225", "x<sup>2</sup> + 15x + 225", "x<sup>2</sup> + 30", "x<sup>2</sup> + 15"], answer: "x<sup>2</sup> + 30x + 225" },
            { question: "(x - 16)<sup>2</sup>", options: ["x<sup>2</sup> - 32x + 256", "x<sup>2</sup> - 16x + 256", "x<sup>2</sup> - 32", "x<sup>2</sup> - 16"], answer: "x<sup>2</sup> - 32x + 256" },
            { question: "(x + 17)(x - 17)", options: ["x<sup>2</sup> - 289", "x<sup>2</sup> + 17", "x<sup>2</sup> + 289", "x + 17"], answer: "x<sup>2</sup> - 289" }
        ],
        "Veeltermen": [
            { question: "Wat is een veelterm?", options: ["Een som van termen", "Een product van termen", "Een deling van termen", "Een macht van termen"], answer: "Een som van termen" },
            { question: "Verschil van kwadraten", options: ["a<sup>2</sup> - b<sup>2</sup>", "a<sup>2</sup> + 2ab + b<sup>2</sup>", "a<sup>2</sup> - 2ab + b<sup>2</sup>", "a<sup>2</sup> + b<sup>2</sup>"], answer: "a<sup>2</sup> - b<sup>2</sup>" },
            { question: "(x + 2)(x - 2)", options: ["x<sup>2</sup> - 4", "x<sup>2</sup> + 4", "x<sup>2</sup> - 2", "x<sup>2</sup> + 2"], answer: "x<sup>2</sup> - 4" },
            { question: "(x + 3)(x - 3)", options: ["x<sup>2</sup> - 9", "x<sup>2</sup> + 9", "x<sup>2</sup> - 3", "x<sup>2</sup> + 3"], answer: "x<sup>2</sup> - 9" },
            { question: "(x + 4)(x - 4)", options: ["x<sup>2</sup> - 16", "x<sup>2</sup> + 16", "x<sup>2</sup> - 4", "x<sup>2</sup> + 4"], answer: "x<sup>2</sup> - 16" },
            { question: "(x + 5)(x - 5)", options: ["x<sup>2</sup> - 25", "x<sup>2</sup> + 25", "x<sup>2</sup> - 5", "x<sup>2</sup> + 5"], answer: "x<sup>2</sup> - 25" },
            { question: "(x + 6)(x - 6)", options: ["x<sup>2</sup> - 36", "x<sup>2</sup> + 36", "x<sup>2</sup> - 6", "x<sup>2</sup> + 6"], answer: "x<sup>2</sup> - 36" },
            { question: "(x + 7)(x - 7)", options: ["x<sup>2</sup> - 49", "x<sup>2</sup> + 49", "x<sup>2</sup> - 7", "x<sup>2</sup> + 7"], answer: "x<sup>2</sup> - 49" },
            { question: "(x + 8)(x - 8)", options: ["x<sup>2</sup> - 64", "x<sup>2</sup> + 64", "x<sup>2</sup> - 8", "x<sup>2</sup> + 8"], answer: "x<sup>2</sup> - 64" },
            { question: "(x + 9)(x - 9)", options: ["x<sup>2</sup> - 81", "x<sup>2</sup> + 81", "x<sup>2</sup> - 9", "x<sup>2</sup> + 9"], answer: "x<sup>2</sup> - 81" },
            { question: "(x + 10)(x - 10)", options: ["x<sup>2</sup> - 100", "x<sup>2</sup> + 100", "x<sup>2</sup> - 10", "x<sup>2</sup> + 10"], answer: "x<sup>2</sup> - 100" },
            { question: "(x + 11)(x - 11)", options: ["x<sup>2</sup> - 121", "x<sup>2</sup> + 121", "x<sup>2</sup> - 11", "x<sup>2</sup> + 11"], answer: "x<sup>2</sup> - 121" },
            { question: "(x + 12)(x - 12)", options: ["x<sup>2</sup> - 144", "x<sup>2</sup> + 144", "x<sup>2</sup> - 12", "x<sup>2</sup> + 12"], answer: "x<sup>2</sup> - 144" },
            { question: "(x + 13)(x - 13)", options: ["x<sup>2</sup> - 169", "x<sup>2</sup> + 169", "x<sup>2</sup> - 13", "x<sup>2</sup> + 13"], answer: "x<sup>2</sup> - 169" },
            { question: "(x + 14)(x - 14)", options: ["x<sup>2</sup> - 196", "x<sup>2</sup> + 196", "x<sup>2</sup> - 14", "x<sup>2</sup> + 14"], answer: "x<sup>2</sup> - 196" },
            { question: "(x + 15)(x - 15)", options: ["x<sup>2</sup> - 225", "x<sup>2</sup> + 225", "x<sup>2</sup> - 15", "x<sup>2</sup> + 15"], answer: "x<sup>2</sup> - 225" },
            { question: "(x + 16)(x - 16)", options: ["x<sup>2</sup> - 256", "x<sup>2</sup> + 256", "x<sup>2</sup> - 16", "x<sup>2</sup> + 16"], answer: "x<sup>2</sup> - 256" },
            { question: "(x + 17)(x - 17)", options: ["x<sup>2</sup> - 289", "x<sup>2</sup> + 289", "x<sup>2</sup> - 17", "x<sup>2</sup> + 17"], answer: "x<sup>2</sup> - 289" },
            { question: "(x + 18)(x - 18)", options: ["x<sup>2</sup> - 324", "x<sup>2</sup> + 324", "x<sup>2</sup> - 18", "x<sup>2</sup> + 18"], answer: "x<sup>2</sup> - 324" },
            { question: "(x + 19)(x - 19)", options: ["x<sup>2</sup> - 361", "x<sup>2</sup> + 361", "x<sup>2</sup> - 19", "x<sup>2</sup> + 19"], answer: "x<sup>2</sup> - 361" },
            { question: "(x + 20)(x - 20)", options: ["x<sup>2</sup> - 400", "x<sup>2</sup> + 400", "x<sup>2</sup> - 20", "x<sup>2</sup> + 20"], answer: "x<sup>2</sup> - 400" },
            { question: "(x + 21)(x - 21)", options: ["x<sup>2</sup> - 441", "x<sup>2</sup> + 441", "x<sup>2</sup> - 21", "x<sup>2</sup> + 21"], answer: "x<sup>2</sup> - 441" },
            { question: "(x + 22)(x - 22)", options: ["x<sup>2</sup> - 484", "x<sup>2</sup> + 484", "x<sup>2</sup> - 22", "x<sup>2</sup> + 22"], answer: "x<sup>2</sup> - 484" },
            { question: "(x + 23)(x - 23)", options: ["x<sup>2</sup> - 529", "x<sup>2</sup> + 529", "x<sup>2</sup> - 23", "x<sup>2</sup> + 23"], answer: "x<sup>2</sup> - 529" },
            { question: "(x + 24)(x - 24)", options: ["x<sup>2</sup> - 576", "x<sup>2</sup> + 576", "x<sup>2</sup> - 24", "x<sup>2</sup> + 24"], answer: "x<sup>2</sup> - 576" },
            { question: "(x + 25)(x - 25)", options: ["x<sup>2</sup> - 625", "x<sup>2</sup> + 625", "x<sup>2</sup> - 25", "x<sup>2</sup> + 25"], answer: "x<sup>2</sup> - 625" },
            { question: "(x + 26)(x - 26)", options: ["x<sup>2</sup> - 676", "x<sup>2</sup> + 676", "x<sup>2</sup> - 26", "x<sup>2</sup> + 26"], answer: "x<sup>2</sup> - 676" },
            { question: "(x + 27)(x - 27)", options: ["x<sup>2</sup> - 729", "x<sup>2</sup> + 729", "x<sup>2</sup> - 27", "x<sup>2</sup> + 27"], answer: "x<sup>2</sup> - 729" }
        ],
        "Vierkantswortels": [
            { question: "√25", options: ["5", "4", "6", "7"], answer: "5" },
            { question: "√49", options: ["7", "6", "8", "9"], answer: "7" },
            { question: "√64", options: ["8", "7", "9", "6"], answer: "8" },
            { question: "√81", options: ["9", "8", "7", "6"], answer: "9" },
            { question: "√100", options: ["10", "9", "11", "8"], answer: "10" },
            { question: "√121", options: ["11", "10", "12", "9"], answer: "11" },
            { question: "√144", options: ["12", "11", "13", "10"], answer: "12" },
            { question: "√169", options: ["13", "12", "11", "14"], answer: "13" },
            { question: "√196", options: ["14", "13", "15", "12"], answer: "14" },
            { question: "√225", options: ["15", "14", "13", "12"], answer: "15" },
            { question: "√256", options: ["16", "15", "14", "13"], answer: "16" },
            { question: "√289", options: ["17", "16", "15", "14"], answer: "17" },
            { question: "√324", options: ["18", "17", "16", "15"], answer: "18" },
            { question: "√361", options: ["19", "18", "17", "16"], answer: "19" },
            { question: "√400", options: ["20", "19", "18", "17"], answer: "20" },
            { question: "√441", options: ["21", "20", "19", "18"], answer: "21" },
            { question: "√484", options: ["22", "21", "20", "19"], answer: "22" },
            { question: "√529", options: ["23", "22", "21", "20"], answer: "23" },
            { question: "√576", options: ["24", "23", "22", "21"], answer: "24" },
            { question: "√625", options: ["25", "24", "23", "22"], answer: "25" },
            { question: "√676", options: ["26", "25", "24", "23"], answer: "26" },
            { question: "√729", options: ["27", "26", "25", "24"], answer: "27" },
            { question: "√784", options: ["28", "27", "26", "25"], answer: "28" },
            { question: "√841", options: ["29", "28", "27", "26"], answer: "29" },
            { question: "√900", options: ["30", "29", "28", "27"], answer: "30" },
            { question: "√961", options: ["31", "30", "29", "28"], answer: "31" },
            { question: "√1024", options: ["32", "31", "30", "29"], answer: "32" },
            { question: "√1089", options: ["33", "32", "31", "30"], answer: "33" },
            { question: "√1156", options: ["34", "33", "32", "31"], answer: "34" },
            { question: "√1225", options: ["35", "34", "33", "32"], answer: "35" }
        ],
        "Ontbinden in factoren": [
            { question: "x<sup>2</sup> - 9", options: ["(x + 3)(x - 3)", "(x + 2)(x - 2)", "(x + 9)(x - 9)", "x(x - 9)"], answer: "(x + 3)(x - 3)" },
            { question: "x<sup>2</sup> + 5x + 6", options: ["(x + 2)(x + 3)", "(x + 1)(x + 6)", "(x + 3)(x - 2)", "x(x + 6)"], answer: "(x + 2)(x + 3)" },
            { question: "x<sup>2</sup> - 4x + 4", options: ["(x - 2)(x - 2)", "(x - 2)(x + 2)", "(x + 2)(x + 2)", "(x + 4)(x - 4)"], answer: "(x - 2)(x - 2)" },
            { question: "x<sup>2</sup> - 16", options: ["(x + 4)(x - 4)", "(x + 2)(x - 2)", "(x + 8)(x - 8)", "x(x - 4)"], answer: "(x + 4)(x - 4)" },
            { question: "x<sup>2</sup> - 25", options: ["(x + 5)(x - 5)", "(x + 4)(x - 4)", "(x + 2)(x - 2)", "x(x - 5)"], answer: "(x + 5)(x - 5)" },
            { question: "x<sup>2</sup> - 36", options: ["(x + 6)(x - 6)", "(x + 5)(x - 5)", "(x + 4)(x - 4)", "x(x - 6)"], answer: "(x + 6)(x - 6)" },
            { question: "x<sup>2</sup> - 49", options: ["(x + 7)(x - 7)", "(x + 6)(x - 6)", "(x + 5)(x - 5)", "x(x - 7)"], answer: "(x + 7)(x - 7)" },
            { question: "x<sup>2</sup> - 64", options: ["(x + 8)(x - 8)", "(x + 7)(x - 7)", "(x + 6)(x - 6)", "x(x - 8)"], answer: "(x + 8)(x - 8)" },
            { question: "x<sup>2</sup> - 81", options: ["(x + 9)(x - 9)", "(x + 8)(x - 8)", "(x + 7)(x - 7)", "x(x - 9)"], answer: "(x + 9)(x - 9)" },
            { question: "x<sup>2</sup> - 100", options: ["(x + 10)(x - 10)", "(x + 9)(x - 9)", "(x + 8)(x - 8)", "x(x - 10)"], answer: "(x + 10)(x - 10)" },
            { question: "x<sup>2</sup> - 121", options: ["(x + 11)(x - 11)", "(x + 10)(x - 10)", "(x + 9)(x - 9)", "x(x - 11)"], answer: "(x + 11)(x - 11)" },
            { question: "x<sup>2</sup> - 144", options: ["(x + 12)(x - 12)", "(x + 11)(x - 11)", "(x + 10)(x - 10)", "x(x - 12)"], answer: "(x + 12)(x - 12)" },
            { question: "x<sup>2</sup> - 169", options: ["(x + 13)(x - 13)", "(x + 12)(x - 12)", "(x + 11)(x - 11)", "x(x - 13)"], answer: "(x + 13)(x - 13)" },
            { question: "x<sup>2</sup> - 196", options: ["(x + 14)(x - 14)", "(x + 13)(x - 13)", "(x + 12)(x - 12)", "x(x - 14)"], answer: "(x + 14)(x - 14)" },
            { question: "x<sup>2</sup> - 225", options: ["(x + 15)(x - 15)", "(x + 14)(x - 14)", "(x + 13)(x - 13)", "x(x - 15)"], answer: "(x + 15)(x - 15)" },
            { question: "x<sup>2</sup> - 256", options: ["(x + 16)(x - 16)", "(x + 15)(x - 15)", "(x + 14)(x - 14)", "x(x - 16)"], answer: "(x + 16)(x - 16)" },
            { question: "x<sup>2</sup> - 289", options: ["(x + 17)(x - 17)", "(x + 16)(x - 16)", "(x + 15)(x - 15)", "x(x - 17)"], answer: "(x + 17)(x - 17)" },
            { question: "x<sup>2</sup> - 324", options: ["(x + 18)(x - 18)", "(x + 17)(x - 17)", "(x + 16)(x - 16)", "x(x - 18)"], answer: "(x + 18)(x - 18)" },
            { question: "x<sup>2</sup> - 361", options: ["(x + 19)(x - 19)", "(x + 18)(x - 18)", "(x + 17)(x - 17)", "x(x - 19)"], answer: "(x + 19)(x - 19)" },
            { question: "x<sup>2</sup> - 400", options: ["(x + 20)(x - 20)", "(x + 19)(x - 19)", "(x + 18)(x - 18)", "x(x - 20)"], answer: "(x + 20)(x - 20)" },
            { question: "x<sup>2</sup> - 441", options: ["(x + 21)(x - 21)", "(x + 20)(x - 20)", "(x + 19)(x - 19)", "x(x - 21)"], answer: "(x + 21)(x - 21)" },
            { question: "x<sup>2</sup> - 484", options: ["(x + 22)(x - 22)", "(x + 21)(x - 21)", "(x + 20)(x - 20)", "x(x - 22)"], answer: "(x + 22)(x - 22)" },
            { question: "x<sup>2</sup> - 529", options: ["(x + 23)(x - 23)", "(x + 22)(x - 22)", "(x + 21)(x - 21)", "x(x - 23)"], answer: "(x + 23)(x - 23)" },
            { question: "x<sup>2</sup> - 576", options: ["(x + 24)(x - 24)", "(x + 23)(x - 23)", "(x + 22)(x - 22)", "x(x - 24)"], answer: "(x + 24)(x - 24)" },
            { question: "x<sup>2</sup> - 625", options: ["(x + 25)(x - 25)", "(x + 24)(x - 24)", "(x + 23)(x - 23)", "x(x - 25)"], answer: "(x + 25)(x - 25)" },
            { question: "x<sup>2</sup> - 676", options: ["(x + 26)(x - 26)", "(x + 25)(x - 25)", "(x + 24)(x - 24)", "x(x - 26)"], answer: "(x + 26)(x - 26)" },
            { question: "x<sup>2</sup> - 729", options: ["(x + 27)(x - 27)", "(x + 26)(x - 26)", "(x + 25)(x - 25)", "x(x - 27)"], answer: "(x + 27)(x - 27)" },
            { question: "x<sup>2</sup> - 784", options: ["(x + 28)(x - 28)", "(x + 27)(x - 27)", "(x + 26)(x - 26)", "x(x - 28)"], answer: "(x + 28)(x - 28)" },
            { question: "x<sup>2</sup> - 841", options: ["(x + 29)(x - 29)", "(x + 28)(x - 28)", "(x + 27)(x - 27)", "x(x - 29)"], answer: "(x + 29)(x - 29)" }
        ],
        "Eerstegraadsfunctie": [
            { question: "Algemene vorm", options: ["y = mx + b", "y = ax<sup>2</sup> + bx + c", "y = mx<sup>2</sup>", "y = b"], answer: "y = mx + b" },
            { question: "Richtingscoëfficiënt y = 3x + 2", options: ["3", "2", "1", "0"], answer: "3" },
            { question: "Snijpunt met y-as: y = -x + 4", options: ["(0, 4)", "(4, 0)", "(0, -4)", "(0, 1)"], answer: "(0, 4)" },
            { question: "Richtingscoëfficiënt y = 2x - 5", options: ["2", "5", "-2", "-5"], answer: "2" },
            { question: "Snijpunt met y-as: y = 4x + 3", options: ["(0, 3)", "(4, 0)", "(0, -4)", "(0, 4)"], answer: "(0, 3)" },
            { question: "Algemene vorm eerstegraadsfunctie", options: ["y = mx + c", "y = ax<sup>2</sup> + bx + c", "y = mx<sup>2</sup> + b", "y = b"], answer: "y = mx + c" },
            { question: "Snijpunt met y-as: y = x + 1", options: ["(0, 1)", "(1, 0)", "(0, 0)", "(1, 1)"], answer: "(0, 1)" },
            { question: "Richtingscoëfficiënt y = -x + 7", options: ["-1", "7", "1", "-7"], answer: "-1" },
            { question: "Snijpunt met y-as: y = 2x + 5", options: ["(0, 5)", "(2, 0)", "(0, 2)", "(0, 0)"], answer: "(0, 5)" },
            { question: "Algemene vorm", options: ["y = mx + b", "y = ax + b", "y = ax<sup>2</sup> + b", "y = b"], answer: "y = mx + b" },
            { question: "Richtingscoëfficiënt y = 3x - 4", options: ["3", "-4", "-3", "4"], answer: "3" },
            { question: "Snijpunt met y-as: y = 5x + 6", options: ["(0, 6)", "(0, 5)", "(0, 0)", "(0, 1)"], answer: "(0, 6)" },
            { question: "Richtingscoëfficiënt y = -2x - 3", options: ["-2", "2", "-3", "3"], answer: "-2" },
            { question: "Snijpunt met y-as: y = -4x + 5", options: ["(0, 5)", "(0, 4)", "(0, 3)", "(0, 2)"], answer: "(0, 5)" },
            { question: "Algemene vorm lineaire vergelijking", options: ["y = ax + b", "y = ax<sup>2</sup> + bx + c", "y = mx<sup>2</sup>", "y = c"], answer: "y = ax + b" },
            { question: "Richtingscoëfficiënt y = 4x - 1", options: ["4", "-1", "1", "-4"], answer: "4" },
            { question: "Snijpunt met y-as: y = -5x + 2", options: ["(0, 2)", "(0, 5)", "(0, 0)", "(0, 1)"], answer: "(0, 2)" },
            { question: "Richtingscoëfficiënt y = 6x + 3", options: ["6", "3", "-3", "-6"], answer: "6" },
            { question: "Snijpunt met y-as: y = 7x + 4", options: ["(0, 4)", "(0, 7)", "(0, 0)", "(0, 1)"], answer: "(0, 4)" },
            { question: "Algemene vorm van een lijn", options: ["y = mx + b", "y = ax<sup>2</sup> + bx + c", "y = mx<sup>2</sup>", "y = b"], answer: "y = mx + b" },
            { question: "Richtingscoëfficiënt y = 8x - 2", options: ["8", "-2", "-8", "2"], answer: "8" },
            { question: "Snijpunt met y-as: y = 9x + 1", options: ["(0, 1)", "(0, 0)", "(0, 9)", "(0, 8)"], answer: "(0, 1)" },
            { question: "Richtingscoëfficiënt y = -10x + 0", options: ["-10", "0", "10", "1"], answer: "-10" },
            { question: "Snijpunt met y-as: y = 11x - 3", options: ["(0, -3)", "(0, 0)", "(0, 1)", "(0, 2)"], answer: "(0, -3)" },
            { question: "Algemene lineaire functie", options: ["y = mx + b", "y = ax<sup>2</sup> + bx + c", "y = mx", "y = c"], answer: "y = mx + b" },
            { question: "Richtingscoëfficiënt y = 12x + 2", options: ["12", "2", "1", "-2"], answer: "12" },
            { question: "Snijpunt met y-as: y = 13x - 4", options: ["(0, -4)", "(0, 0)", "(0, 4)", "(0, -3)"], answer: "(0, -4)" }
        ]
    };

    const languages = {
        "nl": {
            title: "Machten",
            nextBtn: "Volgende",
            restartBtn: "Herstarten",
            aboutMe: "Over Mij",
            contactMe: "Contacteer Mij",
            footerRights: "&copy; 2024 Wiskunde Majeed. Alle rechten voorbehouden.",
            overlayContenth2: "Over Mij",
            overlayContentp: "Hallo, ik ben Majeed. Ik ben gepassioneerd door wiskunde & technologie en heb deze site gemaakt om anderen te helpen wiskunde op een moderne en interactieve manier te leren.",
            categories: [
                "Machten",
                "Vergelijkingen",
                "Ongelijkheden",
                "Merkwaardige producten",
                "Veeltermen",
                "Vierkantswortels",
                "Ontbinden in factoren",
                "Eerstegraadsfunctie"
            ]
        },
        "en": {
            title: "Powers",
            nextBtn: "Next",
            restartBtn: "Restart",
            aboutMe: "About Me",
            contactMe: "Contact Me",
            footerRights: "&copy; 2024 Wiskunde Majeed. All rights reserved.",
            overlayContenth2: "About Me",
            overlayContentp: "Hello, my name is Majeed. I am passionate about mathematics and technology, and I built this site to help others learn mathematical concepts in a modern and interactive way.",
            categories: [
                "Powers",
                "Equations",
                "Inequalities",
                "Remarkable Products",
                "Polynomials",
                "Square Roots",
                "Factorization",
                "Linear Functions"
            ]
        },
        "fr": {
            title: "Puissances",
            nextBtn: "Suivant",
            restartBtn: "Redémarrer",
            aboutMe: "À Propos de Moi",
            contactMe: "Contactez Moi",
            footerRights: "&copy; 2024 Wiskunde Majeed. Tous droits réservés.",
            overlayContenth2: "À Propos de Moi",
            overlayContentp: "Bonjour, je m'appelle Majeed. Je suis passionné par les mathématiques et la technologie, et j'ai construit ce site pour aider les autres à apprendre des concepts mathématiques de manière moderne et interactive.",
            categories: [
                "Puissances",
                "Équations",
                "Inégalités",
                "Produits Remarquables",
                "Polynômes",
                "Racines Carrées",
                "Factorisation",
                "Fonctions Linéaires"
            ]
        },
        "es": {
            title: "Potencias",
            nextBtn: "Siguiente",
            restartBtn: "Reiniciar",
            aboutMe: "Sobre Mí",
            contactMe: "Contáctame",
            footerRights: "&copy; 2024 Wiskunde Majeed. Todos los derechos reservados.",
            overlayContenth2: "Sobre Mí",
            overlayContentp: "Hola, mi nombre es Majeed. Me apasionan las matemáticas y la tecnología, y creé este sitio para ayudar a otros a aprender conceptos matemáticos de una manera moderna e interactiva.",
            categories: [
                "Potencias",
                "Ecuaciones",
                "Desigualdades",
                "Productos Notables",
                "Polinomios",
                "Raíces Cuadradas",
                "Factorización",
                "Funciones Lineales"
            ]
        },
        "it": {
            title: "Potenze",
            nextBtn: "Prossimo",
            restartBtn: "Ricomincia",
            aboutMe: "Chi Sono",
            contactMe: "Contattami",
            footerRights: "&copy; 2024 Wiskunde Majeed. Tutti i diritti riservati.",
            overlayContenth2: "Chi Sono",
            overlayContentp: "Ciao, mi chiamo Majeed. Sono appassionato di matematica e tecnologia, e ho creato questo sito per aiutare gli altri a imparare i concetti matematici in modo moderno e interattivo.",
            categories: [
                "Potenze",
                "Equazioni",
                "Disuguaglianze",
                "Prodotti Notevoli",
                "Polinomi",
                "Radici Quadrate",
                "Fattorizzazione",
                "Funzioni Lineari"
            ]
        },
        "ar": {
            title: "القوى",
            nextBtn: "التالي",
            restartBtn: "إعادة البدء",
            aboutMe: "عني",
            contactMe: "اتصل بي",
            footerRights: "&copy;ماجد. جميع الحقوق 2024 Wiskunde Majeed.",
            overlayContenth2: "عني",
            overlayContentp: "مرحبًا، اسمي ماجد. أنا شغوف بالرياضيات والتكنولوجيا، وقد أنشأت هذا الموقع لمساعدة الآخرين على تعلم المفاهيم الرياضية بطريقة حديثة وتفاعلية.",
            categories: [
                "القوى",
                "المعادلات",
                "المتباينات",
                "المنتجات الجديرة بالملاحظة",
                "المتعددات الحدود",
                "الجذور التربيعية",
                "التحليل إلى عوامل",
                "الدوال الخطية"
            ]
        },
        "ch": {
            title: "幂次",
            nextBtn: "下一个",
            restartBtn: "重新开始",
            aboutMe: "关于我",
            contactMe: "联系我",
            footerRights: "&copy; 2024 Wiskunde Majeed. 保留所有权利。",
            overlayContenth2: "关于我",
            overlayContentp: "你好，我叫Majeed。我对数学和技术充满热情，建立这个网站是为了帮助他人以现代和互动的方式学习数学概念。",
            categories: [
                "幂次",
                "方程",
                "不等式",
                "显著乘积",
                "多项式",
                "平方根",
                "因式分解",
                "线性函数"
            ]
        }
    };

  
    
    function setLanguage(lang) {
        const selectedLanguage = languages[lang];
        
        // Update teksten
        document.getElementById('category-title').textContent = selectedLanguage.title;
        document.getElementById('next-btn').textContent = selectedLanguage.nextBtn;
        document.getElementById('restart-btn').textContent = selectedLanguage.restartBtn;
        document.getElementById('about-me-btn').textContent = selectedLanguage.aboutMe;
        document.getElementById('contact-me-btn').textContent = selectedLanguage.contactMe;
        document.querySelector('footer .footer-content p').innerHTML = selectedLanguage.footerRights;
        document.title = selectedLanguage.title;
    
        // Update de overlay-inhoud
        document.getElementById('about-me-btn').innerHTML = `<i class="fas fa-user"></i> ${selectedLanguage.aboutMe}`;
        document.getElementById('contact-me-btn').innerHTML = `<i class="fas fa-envelope"></i> ${selectedLanguage.contactMe}`;
    
        // Update de categorieën in het zijmenu
        const menuItems = document.querySelectorAll('.side-menu li');
        menuItems.forEach((item, index) => {
            item.querySelector('.menu-text').textContent = selectedLanguage.categories[index];
        });
    }
    

    document.getElementById('language-selector').addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        setLanguage(selectedLang);
        localStorage.setItem('language', selectedLang); 
    });

    const savedLang = localStorage.getItem('testing') || 'nl';

    function loadCategory(category) {
        currentCategory = category;
        categoryTitle.textContent = currentCategory;
        document.title = `${currentCategory}`;
        exercises = shuffleArray(allExercises[currentCategory]);
        currentExerciseIndex = 0;
        score = 0;
        restartBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        loadExercise(currentExerciseIndex);
    }

    function loadExercise(index) {
        nextBtn.disabled = true;
        if (index < exercises.length) {
            updateProgressBar();
            exerciseContainer.classList.add('animate-out');
            setTimeout(() => {
                exerciseContainer.classList.remove('animate-out');
                exerciseContainer.classList.add('animate-in');
                exerciseText.innerHTML = exercises[index].question;
                optionsContainer.innerHTML = '';
                shuffleArray(exercises[index].options).forEach(option => {
                    const btn = document.createElement('button');
                    btn.textContent = option;
                    btn.className = 'option-btn';
                    btn.addEventListener('click', () => handleOptionClick(btn, exercises[index].answer));
                    optionsContainer.appendChild(btn);
                });
            }, 500);
        } else {
            showFinalScore();
        }
    }    

    function handleOptionClick(button, correctAnswer) {
        nextBtn.disabled = false;
        const selectedAnswer = button.textContent;
        const buttons = optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            button.style.backgroundColor = 'var(--feedback-bg-correct)';
            score++;
            showFeedback('Correct!', 'correct');
        } else {
            button.style.backgroundColor = 'var(--feedback-bg-incorrect)';
            showFeedback('Fout!', 'incorrect');
        }
    }

    function showFinalScore() {
        nextBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
    
        let scoreColor = 'var(--accent-color)';
        if (score / exercises.length >= 0.75) {
            scoreColor = 'var(--feedback-bg-correct)';
        } else if (score / exercises.length >= 0.5) {
            scoreColor = 'var(--accent-color)';
        } else {
            scoreColor = 'var(--feedback-bg-incorrect)';
        }
    
        exerciseText.innerHTML = `<p class="score-text">Je score: <span id="score-counter" style="color:${scoreColor}">0</span>/${exercises.length}</p>`;
        optionsContainer.innerHTML = '';
        let currentScore = 0;
    
        if (score > 0) {
            const interval = setInterval(() => {
                currentScore++;
                document.getElementById('score-counter').textContent = currentScore;
                if (currentScore >= score) {
                    clearInterval(interval);
                }
            }, 200 / score);
        } else {
            document.getElementById('score-counter').textContent = 0;
        }
    }

    restartBtn.addEventListener('click', () => {
        loadCategory(currentCategory);
    });

    function showFeedback(message, status) {
        const feedbackContainer = document.getElementById('feedback-container');

        if (feedbackTimeout) {
            clearTimeout(feedbackTimeout);
        }

        if (feedbackContainer.classList.contains('show')) {
            feedbackContainer.classList.add('hide');
            setTimeout(() => {
                displayFeedback(message, status, feedbackContainer);
            }, 500);
        } else {
            displayFeedback(message, status, feedbackContainer);
        }
    }

    function displayFeedback(message, status, feedbackContainer) {
        feedbackContainer.innerHTML = `<span class="message-text">${message}</span>`;
        feedbackContainer.className = `show ${status}`;
        
        feedbackTimeout = setTimeout(() => {
            feedbackContainer.classList.add('hide');
            feedbackContainer.classList.remove('show');
        }, 3000);
    }

    function shuffleArray(array) {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function updateProgressBar() {
        const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    colorPicker.addEventListener('input', (event) => {
        const selectedColor = event.target.value;
        document.documentElement.style.setProperty('--primary-color', selectedColor);
        localStorage.setItem('primaryColor', selectedColor); // Kleur opslaan in LocalStorage
    });

    resetButton.addEventListener('click', () => {
        const defaultColor = '#3168ff';
        document.documentElement.style.setProperty('--primary-color', defaultColor);
        localStorage.removeItem('primaryColor');

        const defaultLanguage = 'nl';
        setLanguage(defaultLanguage);
        localStorage.removeItem('language');
    });

    const savedColor = localStorage.getItem('primaryColor') || '#3168ff';
    document.documentElement.style.setProperty('--primary-color', savedColor);

    function handleMouseLeave(event) {
        const { left, right, top, bottom } = rgbButton.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;

        const isOutOfProximity = x < left - proximityThreshold || x > right + proximityThreshold ||
            y < top - proximityThreshold || y > bottom + proximityThreshold;

        if (isOutOfProximity) {
            rgbButton.classList.remove('hovered');
        }
    }

    rgbButton.addEventListener('mouseenter', () => {
        rgbButton.classList.add('hovered');
    });

    document.addEventListener('mousemove', handleMouseLeave);

    resetButton.addEventListener('mouseenter', () => {
        resetButton.classList.add('hovered');
    });

    resetButton.addEventListener('mouseleave', () => {
        resetButton.classList.remove('hovered');
    });

    // Voeg een event listener toe voor het selecteren van een taal
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        console.log('Geselecteerde taal:', selectedLanguage);
    });


    menuToggle.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        sideMenu.classList.toggle('is-open', isMenuOpen);
        menuToggle.classList.toggle('open', isMenuOpen);
    });

    document.addEventListener('click', (event) => {
        if (!menuToggle.contains(event.target) && !sideMenu.contains(event.target) && isMenuOpen) {
            isMenuOpen = false;
            sideMenu.classList.remove('is-open');
            menuToggle.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isMenuOpen) {
            isMenuOpen = false;
            sideMenu.classList.remove('is-open');
            menuToggle.classList.remove('open');
        }
    });

    menuItems.forEach(item => {
        item.setAttribute('role', 'menuitem');
        item.addEventListener('click', () => {
            loadCategory(item.querySelector('span').textContent.trim());
        });
    });

    nextBtn.addEventListener('click', () => {
        if (currentExerciseIndex < exercises.length - 1) {
            currentExerciseIndex++;
            loadExercise(currentExerciseIndex);
        } else {
            showFinalScore();
        }
    });

    loadCategory(currentCategory);
    setLanguage(savedLang);
});
