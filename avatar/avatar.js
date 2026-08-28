// ============================================================
// AI DIGITAL TWIN — 3D AVATAR
// Final interactive avatar controller
// ============================================================

import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";

import {
    GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
    VRMLoaderPlugin
} from "@pixiv/three-vrm";


// ============================================================
// CONFIG
// ============================================================

const AVATAR_MODEL =
    "./models/digital_twin.vrm";

const AVATAR_AUDIO =
    "./audio/latest.mp3";


// ============================================================
// SCENE
// ============================================================

const scene =
    new THREE.Scene();

scene.background = null;


// ============================================================
// CAMERA
// ============================================================

const camera =
    new THREE.PerspectiveCamera(
        35,
        window.innerWidth /
            window.innerHeight,
        0.1,
        100
    );

camera.position.set(
    0,
    1.35,
    3.2
);


// ============================================================
// RENDERER
// ============================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.setAnimationLoop(null);

document.body.appendChild(
    renderer.domElement
);


// ============================================================
// LIGHTING
// ============================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        2.0
    );

scene.add(
    ambientLight
);


const keyLight =
    new THREE.DirectionalLight(
        0xffffff,
        2.8
    );

keyLight.position.set(
    2,
    4,
    3
);

scene.add(
    keyLight
);


const fillLight =
    new THREE.DirectionalLight(
        0xc7d2fe,
        1.4
    );

fillLight.position.set(
    -3,
    2,
    2
);

scene.add(
    fillLight
);

// Cyberpunk Rim / Back Light
const rimLight =
    new THREE.DirectionalLight(
        0x6366f1,
        2.5
    );

rimLight.position.set(
    0,
    3,
    -3
);

scene.add(
    rimLight
);

const rimLight2 =
    new THREE.DirectionalLight(
        0x22d3ee,
        1.5
    );

rimLight2.position.set(
    -2,
    1,
    -2
);

scene.add(
    rimLight2
);


// ============================================================
// 3D FLOATING PARTICLES
// ============================================================

const particleCount = 120;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 6;
    particlePositions[i + 1] = Math.random() * 3;
    particlePositions[i + 2] = (Math.random() - 0.5) * 6;
}

particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
);

const particleMaterial = new THREE.PointsMaterial({
    color: 0x818cf8,
    size: 0.035,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
});

const particleField = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleField);


// ============================================================
// ORBIT CONTROLS
// ============================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping =
    true;

controls.dampingFactor =
    0.08;

controls.enablePan =
    false;

controls.minDistance =
    2;

controls.maxDistance =
    6;

controls.target.set(
    0,
    1.3,
    0
);


// ============================================================
// VRM LOADER
// ============================================================

const loader =
    new GLTFLoader();

loader.crossOrigin =
    "anonymous";

loader.register(
    (parser) => {

        return new VRMLoaderPlugin(
            parser
        );

    }
);


// ============================================================
// AVATAR STATE
// ============================================================

let currentVrm =
    null;

let avatarSpeaking =
    false;

let avatarThinking =
    false;


// ============================================================
// LOOK AT TARGET & SMOOTH TRACKING
// ============================================================

const lookAtTarget =
    new THREE.Object3D();

lookAtTarget.position.set(0, 1.35, 2.5);

camera.add(
    lookAtTarget
);

let targetMouseX = 0;
let targetMouseY = 0;
let currentLookX = 0;
let currentLookY = 0;


// ============================================================
// MOUSE LOOK WITH NATURAL CLAMPED BOUNDS
// ============================================================

window.addEventListener(
    "mousemove",
    (event) => {

        const normX =
            (event.clientX / window.innerWidth) * 2 - 1;

        const normY =
            -((event.clientY / window.innerHeight) * 2 - 1);

        // Clamped to natural human look cone
        targetMouseX =
            THREE.MathUtils.clamp(normX * 1.5, -1.2, 1.2);

        targetMouseY =
            THREE.MathUtils.clamp(normY * 0.8, -0.6, 0.8);

    }
);


// ============================================================
// LOAD AVATAR
// ============================================================

loader.loadAsync(
    AVATAR_MODEL
)
.then(
    (gltf) => {

        console.log(
            "GLTF loaded successfully"
        );


        const vrm =
            gltf.userData.vrm;


        if (!vrm) {

            console.error(
                "❌ VRM data not found."
            );

            return;

        }


        currentVrm =
            vrm;


        scene.add(
            currentVrm.scene
        );


        currentVrm.scene.position.set(
            0,
            0,
            0
        );


        // Face front towards camera
        currentVrm.scene.rotation.y =
            0;


        if (
            currentVrm.lookAt
        ) {

            currentVrm.lookAt.target =
                lookAtTarget;

        }


        console.log(
            "✅ VRM Avatar loaded successfully"
        );


        if (
            currentVrm.expressionManager
        ) {

            console.log(
                "✅ Expression manager available"
            );

            console.log(
                "Available expressions:",
                currentVrm
                    .expressionManager
                    .expressions
            );

        }


        if (
            currentVrm.humanoid
        ) {

            console.log(
                "✅ Humanoid system available"
            );

        }

    }
)
.catch(
    (error) => {

        console.error(
            "❌ VRM Avatar loading failed:",
            error
        );

    }
);


// ============================================================
// STATUS UI
// ============================================================

const statusElement =
    document.getElementById("avatar-status") ||
    document.createElement("div");

const statusTextElement =
    document.getElementById("status-text");


// ============================================================
// STATUS FUNCTION
// ============================================================

function setAvatarStatus(
    status
) {

    if (!statusElement) return;

    if (
        status === "thinking"
    ) {

        statusElement.className = "thinking";
        if (statusTextElement) statusTextElement.innerText = "THINKING";

    }

    else if (
        status === "speaking"
    ) {

        statusElement.className = "speaking";
        if (statusTextElement) statusTextElement.innerText = "SPEAKING";

    }

    else {

        statusElement.className = "";
        if (statusTextElement) statusTextElement.innerText = "ONLINE";

    }

}


// ============================================================
// VOICE ENABLE BUTTON
// ============================================================

let voiceButton =
    document.getElementById("voice-button");

if (!voiceButton) {
    voiceButton = document.createElement("button");
    voiceButton.id = "voice-button";
    voiceButton.textContent = "🔊 ENABLE VOICE";
    document.body.appendChild(voiceButton);
}


// ============================================================
// AUDIO
// ============================================================

let audioContext =
    null;

let analyser =
    null;

let audioSource =
    null;

let audioData =
    null;

let avatarAudio =
    null;

let voiceEnabled =
    false;


// ============================================================
// AUDIO ANALYSER
// ============================================================

function setupAudioAnalyser(
    audioElement
) {

    if (
        audioContext
    ) {

        return;

    }


    const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;

    if (!AudioContextClass) {
        throw new Error("Web Audio API is not supported in this browser.");
    }

    audioContext =
        new AudioContextClass();


    analyser =
        audioContext.createAnalyser();


    analyser.fftSize =
        256;


    analyser.smoothingTimeConstant =
        0.75;


    audioData =
        new Uint8Array(
            analyser.frequencyBinCount
        );


    audioSource =
        audioContext.createMediaElementSource(
            audioElement
        );


    audioSource.connect(
        analyser
    );


    analyser.connect(
        audioContext.destination
    );


    console.log(
        "✅ Audio analyser ready"
    );

}


// ============================================================
// CREATE AUDIO
// ============================================================

function setupAvatarAudio() {

    if (
        avatarAudio
    ) {

        return;

    }


    avatarAudio =
        new Audio();


    avatarAudio.crossOrigin =
        "anonymous";

    avatarAudio.preload =
        "auto";


    setupAudioAnalyser(
        avatarAudio
    );


    avatarAudio.addEventListener(
        "play",
        () => {

            avatarSpeaking =
                true;

            avatarThinking =
                false;

            setAvatarStatus(
                "speaking"
            );

            document.title =
                "🗣️ Speaking — AI Digital Twin";

            console.log(
                "▶️ Avatar speaking"
            );

        }
    );


    avatarAudio.addEventListener(
        "ended",
        () => {

            avatarSpeaking =
                false;

            setMouthOpen(
                0
            );

            setAvatarStatus(
                "online"
            );

            document.title =
                "AI Digital Twin Avatar";

            console.log(
                "🔊 Avatar audio finished"
            );

        }
    );


    avatarAudio.addEventListener(
        "pause",
        () => {

            if (
                !avatarAudio.ended
            ) {

                avatarSpeaking =
                    false;

                setMouthOpen(
                    0
                );

                setAvatarStatus(
                    "online"
                );

            }

        }
    );


    avatarAudio.addEventListener(
        "error",
        (error) => {

            console.error(
                "❌ Avatar audio error:",
                error
            );

            avatarSpeaking =
                false;

            setAvatarStatus(
                "online"
            );

        }
    );


    console.log(
        "✅ Avatar audio connected"
    );

}


// ============================================================
// ENABLE VOICE
// ============================================================

voiceButton.addEventListener(
    "click",
    async () => {

        try {

            setupAvatarAudio();

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                await audioContext.resume();
            }

            voiceEnabled = true;

            console.log(
                "[AETHER] AudioContext:",
                audioContext?.state
            );

            // The button click is a real user gesture.
            // Start the current TTS audio immediately.
            avatarAudio.src =
                `${AVATAR_AUDIO}?ts=${Date.now()}`;

            avatarAudio.load();

            await avatarAudio.play();

            // Prevent the polling loop from replaying the same file.
            try {
                const response = await fetch(
                    `${AVATAR_AUDIO}?ts=${Date.now()}`,
                    {
                        method: "HEAD",
                        cache: "no-store"
                    }
                );

                if (response.ok) {
                    const modified =
                        response.headers.get("last-modified") || "";

                    const size =
                        response.headers.get("content-length") || "";

                    lastAudioVersion =
                        `${modified}-${size}`;
                }
            } catch (versionError) {
                console.warn(
                    "[AETHER] Could not record audio version:",
                    versionError
                );
            }

            console.log(
                "🔓 Voice enabled + audio playing"
            );

            // Hide only after successful playback.
            voiceButton.remove();

        }
        catch (error) {

            voiceEnabled = false;

            console.error(
                "❌ Voice enable failed:",
                error
            );

            console.log(
                "[AETHER] Check that ./audio/latest.mp3 exists."
            );

            setAvatarStatus("online");
        }

    }
);


// ============================================================
// MOUTH CONTROL
// ============================================================

function setMouthOpen(
    value
) {

    if (
        !currentVrm
    ) {

        return;

    }


    const expressionManager =
        currentVrm.expressionManager;


    if (
        !expressionManager
    ) {

        return;

    }


    expressionManager.setValue(
        "aa",
        value
    );

}


// ============================================================
// AUDIO LIP SYNC
// ============================================================

function updateLipSync() {

    if (
        !analyser ||
        !currentVrm ||
        !avatarSpeaking
    ) {

        return;

    }


    analyser.getByteFrequencyData(
        audioData
    );


    let sum =
        0;


    for (
        let i = 0;
        i < audioData.length;
        i++
    ) {

        sum +=
            audioData[i];

    }


    const average =
        sum /
        audioData.length;


    const targetMouth =
        Math.min(
            average / 75,
            1
        );


    setMouthOpen(
        targetMouth
    );

}


// ============================================================
// AUDIO FILE DETECTION
// ============================================================

let lastAudioVersion =
    "";


async function checkForNewAudio() {

    // Do not attempt autoplay until the user has explicitly
    // enabled voice through the button.
    if (!voiceEnabled) {
        return;
    }

    try {

        const response =
            await fetch(
                `${AVATAR_AUDIO}?ts=${Date.now()}`,
                {
                    method: "HEAD",
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            return;
        }

        const modified =
            response.headers.get("last-modified") || "";

        const size =
            response.headers.get("content-length") || "";

        const version =
            `${modified}-${size}`;

        if (
            lastAudioVersion === version
        ) {
            return;
        }

        console.log(
            "🔊 New TTS audio detected"
        );

        setupAvatarAudio();

        avatarAudio.src =
            `${AVATAR_AUDIO}?ts=${Date.now()}`;

        avatarAudio.load();

        try {

            if (
                audioContext &&
                audioContext.state === "suspended"
            ) {
                await audioContext.resume();
            }

            await avatarAudio.play();

            // IMPORTANT:
            // Mark the file as processed only after
            // playback succeeds.
            lastAudioVersion =
                version;

            console.log(
                "▶️ New avatar audio playing"
            );

        }
        catch (error) {

            console.warn(
                "⚠️ Automatic playback failed:",
                error
            );

            console.log(
                "Voice remains enabled; retrying on next audio change."
            );

        }

    }
    catch (error) {

        console.warn(
            "Audio detection failed:",
            error
        );

    }

}


// ============================================================
// IDLE MULTI-JOINT BREATHING & HEAD SWAY
// ============================================================

let idleTime = 0;

function updateIdleMovement(delta) {
    if (!currentVrm || !currentVrm.humanoid) return;
    idleTime += delta;

    const head = currentVrm.humanoid.getNormalizedBoneNode("head");
    const neck = currentVrm.humanoid.getNormalizedBoneNode("neck");
    const spine = currentVrm.humanoid.getNormalizedBoneNode("spine");
    const chest = currentVrm.humanoid.getNormalizedBoneNode("chest") ||
                  currentVrm.humanoid.getNormalizedBoneNode("upperChest");

    // Natural multi-frequency organic breathing
    const breath = Math.sin(idleTime * 1.3) * 0.012;
    const swayX = Math.sin(idleTime * 0.7) * 0.02;
    const swayY = Math.cos(idleTime * 0.5) * 0.015;
    const tiltZ = Math.sin(idleTime * 0.35) * 0.008;

    if (spine) {
        spine.rotation.x = breath * 0.6;
    }
    if (chest) {
        chest.rotation.x = breath * 0.4;
    }
    if (neck) {
        neck.rotation.x = breath * 0.3 + swayX * 0.25;
        neck.rotation.y = swayY * 0.3;
    }
    if (head) {
        head.rotation.x = swayX * 0.6;
        head.rotation.y = swayY * 0.5;
        head.rotation.z = tiltZ;
    }
}


// ============================================================
// CONVERSATIONAL SPEAKING HEAD MOVEMENT
// ============================================================

function updateSpeakingMovement(delta) {
    if (!currentVrm || !currentVrm.humanoid || !avatarSpeaking) return;
    idleTime += delta;

    const head = currentVrm.humanoid.getNormalizedBoneNode("head");
    const neck = currentVrm.humanoid.getNormalizedBoneNode("neck");
    const spine = currentVrm.humanoid.getNormalizedBoneNode("spine");

    const speechTime = performance.now() * 0.003;
    // Conversational nodding cadence with syllable emphasis
    const nod = Math.sin(speechTime * 2.4) * 0.04 + Math.sin(speechTime * 4.8) * 0.012;
    const sway = Math.sin(speechTime * 1.1) * 0.025;
    const tilt = Math.cos(speechTime * 0.9) * 0.018;

    if (spine) {
        spine.rotation.x = Math.sin(speechTime * 1.2) * 0.008;
    }
    if (neck) {
        neck.rotation.x = nod * 0.35;
        neck.rotation.y = sway * 0.35;
    }
    if (head) {
        head.rotation.x = nod * 0.65;
        head.rotation.y = sway * 0.55;
        head.rotation.z = tilt;
    }
}


// ============================================================
// BLINKING
// ============================================================

let blinkTimer = 0;
let nextBlink = 3 + Math.random() * 3;

function updateBlinking(delta) {
    if (!currentVrm || !currentVrm.expressionManager) return;

    blinkTimer += delta;

    if (blinkTimer >= nextBlink) {
        blinkTimer = 0;
        nextBlink = 2.5 + Math.random() * 3.5;

        const expressionManager = currentVrm.expressionManager;
        expressionManager.setValue("blink", 1);

        setTimeout(() => {
            if (currentVrm && currentVrm.expressionManager) {
                currentVrm.expressionManager.setValue("blink", 0);
            }
        }, 120);
    }
}


// ============================================================
// AVATAR UPDATE
// ============================================================

function updateAvatar(delta) {
    if (!currentVrm) return;

    // Smooth lerp lookAt target position for natural eye gaze
    currentLookX += (targetMouseX - currentLookX) * 0.06;
    currentLookY += (targetMouseY - currentLookY) * 0.06;

    lookAtTarget.position.x = currentLookX;
    lookAtTarget.position.y = 1.35 + currentLookY * 0.35;
    lookAtTarget.position.z = 2.5;

    currentVrm.update(delta);

    if (avatarSpeaking) {
        updateSpeakingMovement(delta);
    } else {
        updateIdleMovement(delta);
    }

    updateBlinking(delta);
}


// ============================================================
// ANIMATION LOOP
// ============================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    updateAvatar(
        delta
    );


    if (particleField) {
        particleField.rotation.y += delta * 0.04;
        particleField.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
    }


    updateLipSync();


    controls.update();


    renderer.render(
        scene,
        camera
    );

}


// ============================================================
// START AUDIO MONITORING
// ============================================================

setInterval(
    checkForNewAudio,
    2000
);


// ============================================================
// START RENDERING
// ============================================================

animate();


// ============================================================
// RESPONSIVE
// ============================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// ============================================================
// DEBUG
// ============================================================

window.digitalTwin = {

    getAvatar: () =>
        currentVrm,

    getAudio: () =>
        avatarAudio,

    setStatus:
        setAvatarStatus,

    playAudio: async () => {

        setupAvatarAudio();

        if (
            audioContext &&
            audioContext.state ===
                "suspended"
        ) {

            await audioContext.resume();

        }

        voiceEnabled = true;

        avatarAudio.src =
            `${AVATAR_AUDIO}?ts=${Date.now()}`;

        avatarAudio.load();

        await avatarAudio.play();

    }

};


console.log(
    "🧠 AI Digital Twin avatar system initialized"
);

console.log(
    "[AETHER] Click 🔊 ENABLE VOICE to activate audio."
);