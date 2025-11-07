// client/src/components/FruitIllustration.js
// 2D illustrated fruit SVG components

import React from 'react';

const FruitIllustration = ({ type = 'apple', color = '#FF6B6B', size = 100 }) => {
    const illustrations = {
        tomato: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Main tomato body */}
                <ellipse cx="50" cy="55" rx="38" ry="35" fill={color} />
                
                {/* Top indent */}
                <path d="M 30 35 Q 35 30 40 35" fill="none" stroke={color} strokeWidth="2" opacity="0.3"/>
                
                {/* Leaves/stem */}
                <path d="M 35 25 Q 30 20 35 15 Q 40 20 35 25" fill="#4A7C4E" />
                <path d="M 45 23 Q 45 15 50 12 Q 55 15 55 23" fill="#4A7C4E" />
                <path d="M 65 25 Q 70 20 65 15 Q 60 20 65 25" fill="#5C8C5F" />
                <path d="M 50 20 L 50 30" stroke="#4A7C4E" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Highlight */}
                <ellipse cx="35" cy="45" rx="12" ry="10" fill="white" opacity="0.2" />
                
                {/* Texture dots */}
                <circle cx="40" cy="60" r="1" fill="#000" opacity="0.15" />
                <circle cx="45" cy="65" r="1" fill="#000" opacity="0.15" />
                <circle cx="55" cy="58" r="1" fill="#000" opacity="0.15" />
                <circle cx="60" cy="65" r="1" fill="#000" opacity="0.15" />
                <circle cx="50" cy="70" r="1" fill="#000" opacity="0.15" />
            </svg>
        ),
        apple: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Main apple body */}
                <path d="M 50 30 Q 25 30 20 55 Q 20 75 35 85 Q 45 90 50 90 Q 55 90 65 85 Q 80 75 80 55 Q 75 30 50 30" fill={color} />
                
                {/* Top indent */}
                <ellipse cx="50" cy="32" rx="8" ry="4" fill="#000" opacity="0.1" />
                
                {/* Stem */}
                <rect x="48" y="15" width="4" height="18" fill="#6B4423" rx="2" />
                
                {/* Leaf */}
                <ellipse cx="58" cy="20" rx="12" ry="8" fill="#4A7C4E" transform="rotate(30 58 20)" />
                <path d="M 58 16 Q 58 22 58 24" stroke="#3A5C3E" strokeWidth="1.5" fill="none" />
                
                {/* Highlight */}
                <ellipse cx="35" cy="50" rx="15" ry="18" fill="white" opacity="0.25" />
                
                {/* Texture dots */}
                <circle cx="55" cy="55" r="1.5" fill="#000" opacity="0.12" />
                <circle cx="60" cy="60" r="1.5" fill="#000" opacity="0.12" />
                <circle cx="45" cy="65" r="1.5" fill="#000" opacity="0.12" />
            </svg>
        ),
        orange: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Main orange body */}
                <circle cx="50" cy="52" r="35" fill={color} />
                
                {/* Leaf */}
                <ellipse cx="50" cy="18" rx="10" ry="6" fill="#4A7C4E" transform="rotate(-20 50 18)" />
                
                {/* Stem nub */}
                <circle cx="50" cy="17" r="3" fill="#6B4423" />
                
                {/* Highlight */}
                <ellipse cx="38" cy="42" rx="12" ry="14" fill="white" opacity="0.25" />
                
                {/* Texture dots - lots for orange peel */}
                {[...Array(50)].map((_, i) => {
                    const angle = (i / 50) * Math.PI * 2;
                    const radius = 20 + Math.random() * 12;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 52 + Math.sin(angle) * radius;
                    return <circle key={i} cx={cx} cy={cy} r="0.8" fill="#000" opacity="0.15" />;
                })}
            </svg>
        ),
        grape: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Grape bunch */}
                <circle cx="50" cy="75" r="10" fill={color} />
                <circle cx="40" cy="75" r="10" fill={color} opacity="0.95" />
                <circle cx="60" cy="75" r="10" fill={color} opacity="0.95" />
                
                <circle cx="45" cy="63" r="10" fill={color} opacity="0.9" />
                <circle cx="55" cy="63" r="10" fill={color} opacity="0.9" />
                <circle cx="35" cy="63" r="9" fill={color} opacity="0.85" />
                <circle cx="65" cy="63" r="9" fill={color} opacity="0.85" />
                
                <circle cx="50" cy="51" r="10" fill={color} opacity="0.88" />
                <circle cx="40" cy="51" r="9" fill={color} opacity="0.85" />
                <circle cx="60" cy="51" r="9" fill={color} opacity="0.85" />
                
                <circle cx="50" cy="40" r="9" fill={color} opacity="0.85" />
                <circle cx="45" cy="31" r="8" fill={color} opacity="0.82" />
                <circle cx="55" cy="31" r="8" fill={color} opacity="0.82" />
                
                {/* Stem */}
                <path d="M 50 25 Q 48 18 50 12" stroke="#6B4423" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Leaf */}
                <ellipse cx="55" cy="15" rx="12" ry="8" fill="#4A7C4E" transform="rotate(30 55 15)" />
                <path d="M 55 11 Q 55 17 55 19" stroke="#3A5C3E" strokeWidth="1.5" fill="none" />
                
                {/* Highlights on grapes */}
                <circle cx="47" cy="72" r="3" fill="white" opacity="0.4" />
                <circle cx="52" cy="48" r="3" fill="white" opacity="0.4" />
            </svg>
        ),
        strawberry: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Main strawberry body */}
                <path d="M 50 30 Q 65 35 70 50 Q 72 65 65 75 Q 55 85 50 87 Q 45 85 35 75 Q 28 65 30 50 Q 35 35 50 30" fill={color} />
                
                {/* Leaves on top */}
                <path d="M 35 28 Q 30 25 28 20 Q 32 18 35 22" fill="#4A7C4E" />
                <path d="M 42 26 Q 40 20 38 15 Q 42 14 44 20" fill="#5C8C5F" />
                <path d="M 50 25 Q 50 18 50 12 Q 54 14 54 20" fill="#4A7C4E" />
                <path d="M 58 26 Q 60 20 62 15 Q 66 16 62 22" fill="#5C8C5F" />
                <path d="M 65 28 Q 70 25 72 20 Q 68 18 65 22" fill="#4A7C4E" />
                
                {/* Yellow seeds */}
                {[...Array(20)].map((_, i) => {
                    const positions = [
                        [45, 40], [55, 40], [40, 48], [50, 47], [60, 48],
                        [38, 56], [48, 56], [58, 56], [42, 64], [52, 64],
                        [62, 64], [40, 72], [50, 72], [60, 72], [45, 78],
                        [55, 78], [50, 82], [44, 50], [56, 50], [50, 60]
                    ];
                    if (positions[i]) {
                        return (
                            <ellipse 
                                key={i} 
                                cx={positions[i][0]} 
                                cy={positions[i][1]} 
                                rx="1.5" 
                                ry="2" 
                                fill="#F4E04D" 
                            />
                        );
                    }
                    return null;
                })}
                
                {/* Highlight */}
                <ellipse cx="40" cy="45" rx="8" ry="10" fill="white" opacity="0.2" />
            </svg>
        ),
        cherry: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Cherry stems */}
                <path d="M 35 40 Q 38 25 45 15" stroke="#6B4423" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 65 40 Q 62 25 55 15" stroke="#6B4423" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                
                {/* Leaf */}
                <ellipse cx="50" cy="18" rx="12" ry="7" fill="#4A7C4E" transform="rotate(-10 50 18)" />
                
                {/* Cherry bodies */}
                <circle cx="35" cy="55" r="18" fill={color} />
                <circle cx="65" cy="58" r="18" fill={color} />
                
                {/* Highlights */}
                <circle cx="30" cy="48" r="6" fill="white" opacity="0.35" />
                <circle cx="60" cy="51" r="6" fill="white" opacity="0.35" />
                
                {/* Shadow on cherries */}
                <ellipse cx="40" cy="60" rx="8" ry="10" fill="#000" opacity="0.1" />
                <ellipse cx="70" cy="63" rx="8" ry="10" fill="#000" opacity="0.1" />
            </svg>
        ),
        watermelon: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Main watermelon body */}
                <ellipse cx="50" cy="55" rx="40" ry="35" fill={color} />
                
                {/* Dark green stripes */}
                <ellipse cx="30" cy="55" rx="5" ry="32" fill="#000" opacity="0.15" />
                <ellipse cx="50" cy="55" rx="5" ry="35" fill="#000" opacity="0.15" />
                <ellipse cx="70" cy="55" rx="5" ry="32" fill="#000" opacity="0.15" />
                
                {/* Stem */}
                <path d="M 48 20 Q 45 15 48 12" stroke="#6B4423" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Curly tendril */}
                <path d="M 52 22 Q 58 20 60 18 Q 62 16 64 18 Q 66 20 64 22" stroke="#4A7C4E" strokeWidth="2" fill="none" />
                
                {/* Highlight */}
                <ellipse cx="35" cy="45" rx="15" ry="12" fill="white" opacity="0.2" />
            </svg>
        ),
        banana: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Banana body - curved */}
                <path d="M 30 40 Q 25 50 28 60 Q 32 70 40 75 Q 50 78 60 75 Q 68 72 72 65 Q 75 58 73 50 Q 70 42 65 38" 
                    fill={color} 
                    stroke={color} 
                    strokeWidth="2" 
                />
                
                {/* Inner lighter color */}
                <path d="M 32 42 Q 28 50 30 58 Q 33 66 40 71 Q 48 74 58 71 Q 65 68 69 62 Q 71 56 70 50" 
                    fill="none" 
                    stroke="#FFF" 
                    strokeWidth="1.5" 
                    opacity="0.3"
                />
                
                {/* Stem end */}
                <ellipse cx="65" cy="37" rx="4" ry="3" fill="#8B7355" />
                
                {/* Brown spots */}
                <ellipse cx="40" cy="55" rx="3" ry="4" fill="#8B6F47" opacity="0.4" />
                <ellipse cx="50" cy="62" rx="2.5" ry="3.5" fill="#8B6F47" opacity="0.4" />
                <ellipse cx="58" cy="58" rx="3" ry="4" fill="#8B6F47" opacity="0.4" />
                <ellipse cx="48" cy="70" rx="2" ry="3" fill="#8B6F47" opacity="0.4" />
                
                {/* Highlight */}
                <ellipse cx="45" cy="48" rx="10" ry="6" fill="white" opacity="0.25" />
            </svg>
        ),
        pineapple: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Pineapple body */}
                <path d="M 50 35 Q 35 38 30 50 Q 28 62 32 72 Q 38 82 45 86 Q 50 88 55 86 Q 62 82 68 72 Q 72 62 70 50 Q 65 38 50 35" fill={color} />
                
                {/* Diamond pattern */}
                {[40, 50, 60].map(y => 
                    [35, 45, 55, 65].map(x => (
                        <path 
                            key={`${x}-${y}`}
                            d={`M ${x} ${y} L ${x+4} ${y+5} L ${x} ${y+10} L ${x-4} ${y+5} Z`}
                            fill="none"
                            stroke="#000"
                            strokeWidth="1"
                            opacity="0.15"
                        />
                    ))
                )}
                
                {/* Leaves crown */}
                <path d="M 38 32 Q 35 25 38 18 Q 40 22 38 28" fill="#4A7C4E" />
                <path d="M 44 30 Q 42 22 44 14 Q 46 20 44 26" fill="#5C8C5F" />
                <path d="M 50 28 Q 50 20 50 10 Q 52 18 50 26" fill="#4A7C4E" />
                <path d="M 56 30 Q 58 22 56 14 Q 54 20 56 26" fill="#5C8C5F" />
                <path d="M 62 32 Q 65 25 62 18 Q 60 22 62 28" fill="#4A7C4E" />
                
                {/* Dots */}
                {[...Array(15)].map((_, i) => {
                    const x = 35 + (i % 3) * 12;
                    const y = 45 + Math.floor(i / 3) * 10;
                    return <circle key={i} cx={x} cy={y} r="1" fill="#000" opacity="0.2" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="40" cy="50" rx="8" ry="12" fill="white" opacity="0.2" />
            </svg>
        ),
        mango: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Mango body */}
                <path d="M 50 25 Q 70 30 75 50 Q 78 65 70 75 Q 60 85 50 87 Q 40 85 30 75 Q 22 65 25 50 Q 30 30 50 25" fill={color} />
                
                {/* Stem */}
                <path d="M 50 25 Q 48 20 50 15" stroke="#6B4423" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Leaf */}
                <ellipse cx="55" cy="18" rx="10" ry="6" fill="#4A7C4E" transform="rotate(30 55 18)" />
                
                {/* Highlight */}
                <ellipse cx="40" cy="45" rx="15" ry="18" fill="white" opacity="0.25" />
                <ellipse cx="55" cy="60" rx="8" ry="10" fill="#FFD700" opacity="0.2" />
                
                {/* Texture dots */}
                <circle cx="50" cy="55" r="1" fill="#000" opacity="0.12" />
                <circle cx="55" cy="60" r="1" fill="#000" opacity="0.12" />
                <circle cx="60" cy="65" r="1" fill="#000" opacity="0.12" />
            </svg>
        ),
        peach: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Peach body with indent */}
                <circle cx="48" cy="55" r="32" fill={color} />
                <circle cx="52" cy="55" r="32" fill={color} />
                
                {/* Center indent line */}
                <path d="M 50 25 Q 48 40 50 85" stroke="#000" strokeWidth="2" opacity="0.1" fill="none" />
                
                {/* Stem */}
                <rect x="48" y="15" width="4" height="12" fill="#6B4423" rx="2" />
                
                {/* Leaf */}
                <ellipse cx="56" cy="20" rx="10" ry="6" fill="#4A7C4E" transform="rotate(25 56 20)" />
                <path d="M 56 17 Q 56 22 56 23" stroke="#3A5C3E" strokeWidth="1.5" fill="none" />
                
                {/* Fuzzy texture */}
                {[...Array(30)].map((_, i) => {
                    const angle = (i / 30) * Math.PI * 2;
                    const radius = 15 + Math.random() * 15;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 55 + Math.sin(angle) * radius;
                    return <circle key={i} cx={cx} cy={cy} r="0.5" fill="#FFF" opacity="0.3" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="38" cy="45" rx="12" ry="14" fill="white" opacity="0.25" />
            </svg>
        ),
        cucumber: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Cucumber body - elongated */}
                <ellipse cx="50" cy="50" rx="18" ry="38" fill={color} />
                
                {/* Bumpy texture */}
                {[...Array(20)].map((_, i) => {
                    const y = 20 + (i % 10) * 6;
                    const x = 45 + (Math.floor(i / 10) * 10);
                    return <circle key={i} cx={x} cy={y} r="1.5" fill="#000" opacity="0.1" />;
                })}
                
                {/* Stem end */}
                <ellipse cx="50" cy="15" rx="8" ry="4" fill="#4A7C4E" />
                <circle cx="50" cy="15" r="3" fill="#6B4423" />
                
                {/* Highlight */}
                <ellipse cx="42" cy="35" rx="6" ry="15" fill="white" opacity="0.2" />
            </svg>
        ),
        lemon: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Lemon body - pointed ends */}
                <ellipse cx="50" cy="50" rx="28" ry="35" fill={color} />
                <path d="M 50 15 Q 45 18 45 25" fill={color} />
                <path d="M 50 15 Q 55 18 55 25" fill={color} />
                <path d="M 50 85 Q 45 82 45 75" fill={color} />
                <path d="M 50 85 Q 55 82 55 75" fill={color} />
                
                {/* Stem */}
                <circle cx="50" cy="15" r="2.5" fill="#6B4423" />
                
                {/* Texture */}
                {[...Array(30)].map((_, i) => {
                    const angle = (i / 30) * Math.PI * 2;
                    const radius = 12 + Math.random() * 14;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 50 + Math.sin(angle) * radius;
                    return <circle key={i} cx={cx} cy={cy} r="0.6" fill="#000" opacity="0.1" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="40" cy="40" rx="10" ry="12" fill="white" opacity="0.3" />
            </svg>
        ),
        lettuce: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Lettuce leaves - layered */}
                <ellipse cx="50" cy="55" rx="35" ry="30" fill={color} />
                <path d="M 20 50 Q 15 45 18 38 Q 22 40 25 48" fill={color} opacity="0.9" />
                <path d="M 80 50 Q 85 45 82 38 Q 78 40 75 48" fill={color} opacity="0.9" />
                <path d="M 50 30 Q 45 25 50 20 Q 55 25 50 30" fill={color} opacity="0.95" />
                <ellipse cx="35" cy="45" rx="12" ry="15" fill={color} opacity="0.85" />
                <ellipse cx="65" cy="45" rx="12" ry="15" fill={color} opacity="0.85" />
                
                {/* Veins */}
                <path d="M 50 35 Q 48 45 50 55" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
                <path d="M 35 45 Q 38 50 42 55" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
                <path d="M 65 45 Q 62 50 58 55" stroke="#fff" strokeWidth="1" opacity="0.3" fill="none" />
                
                {/* Highlight */}
                <ellipse cx="40" cy="48" rx="8" ry="10" fill="white" opacity="0.2" />
            </svg>
        ),
        broccoli: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Broccoli crown - multiple circles */}
                <circle cx="50" cy="40" r="12" fill={color} />
                <circle cx="38" cy="45" r="11" fill={color} />
                <circle cx="62" cy="45" r="11" fill={color} />
                <circle cx="45" cy="32" r="10" fill={color} />
                <circle cx="55" cy="32" r="10" fill={color} />
                <circle cx="35" cy="36" r="9" fill={color} />
                <circle cx="65" cy="36" r="9" fill={color} />
                <circle cx="42" cy="52" r="9" fill={color} />
                <circle cx="58" cy="52" r="9" fill={color} />
                
                {/* Stem */}
                <rect x="45" y="55" width="10" height="25" fill="#7FB069" rx="2" />
                <rect x="42" y="75" width="16" height="8" fill="#7FB069" rx="2" />
                
                {/* Texture on florets */}
                {[...Array(15)].map((_, i) => {
                    const positions = [[50,38], [40,43], [60,43], [48,30], [52,30], [38,34], [62,34]];
                    if (positions[i]) {
                        return <circle key={i} cx={positions[i][0]} cy={positions[i][1]} r="1" fill="#000" opacity="0.1" />;
                    }
                    return null;
                })}
            </svg>
        ),
        avocado: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Avocado body - pear shaped */}
                <path d="M 50 20 Q 35 25 30 40 Q 28 55 32 68 Q 40 80 50 85 Q 60 80 68 68 Q 72 55 70 40 Q 65 25 50 20" fill={color} />
                
                {/* Inner lighter flesh */}
                <ellipse cx="50" cy="52" rx="18" ry="22" fill="#D4E157" opacity="0.6" />
                
                {/* Seed */}
                <ellipse cx="50" cy="52" rx="10" ry="12" fill="#8B6F47" />
                <ellipse cx="48" cy="50" rx="4" ry="5" fill="#A0826D" />
                
                {/* Stem */}
                <rect x="48" y="15" width="4" height="8" fill="#6B4423" rx="2" />
                
                {/* Texture */}
                {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 20 + Math.random() * 8;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 52 + Math.sin(angle) * radius;
                    return <circle key={i} cx={cx} cy={cy} r="0.5" fill="#000" opacity="0.08" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="40" cy="38" rx="8" ry="10" fill="white" opacity="0.2" />
            </svg>
        ),
        kiwi: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Kiwi body */}
                <ellipse cx="50" cy="50" rx="32" ry="35" fill={color} />
                
                {/* Fuzzy texture - lots of tiny lines */}
                {[...Array(40)].map((_, i) => {
                    const angle = (i / 40) * Math.PI * 2;
                    const radius = 28;
                    const x = 50 + Math.cos(angle) * radius;
                    const y = 50 + Math.sin(angle) * radius;
                    return (
                        <line 
                            key={i} 
                            x1={x} 
                            y1={y} 
                            x2={x + Math.cos(angle) * 4} 
                            y2={y + Math.sin(angle) * 4} 
                            stroke="#8B7355" 
                            strokeWidth="0.8" 
                            opacity="0.6"
                        />
                    );
                })}
                
                {/* Stem nub */}
                <circle cx="50" cy="15" r="3" fill="#6B4423" />
                
                {/* Highlight */}
                <ellipse cx="42" cy="42" rx="10" ry="12" fill="white" opacity="0.15" />
            </svg>
        ),
        carrot: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Carrot body - tapered */}
                <path d="M 50 30 Q 40 35 35 50 Q 32 65 35 75 Q 40 83 45 87 Q 48 89 50 89 Q 55 87 57 83 Q 60 75 60 65 Q 60 50 55 35 Q 52 30 50 30" fill={color} />
                
                {/* Green tops */}
                <path d="M 45 28 Q 42 20 40 12 Q 42 15 45 22" fill="#4A7C4E" />
                <path d="M 50 26 Q 50 18 50 8 Q 52 15 50 22" fill="#5C8C5F" />
                <path d="M 55 28 Q 58 20 60 12 Q 58 15 55 22" fill="#4A7C4E" />
                <path d="M 48 27 Q 45 18 42 10 Q 45 14 48 20" fill="#5C8C5F" />
                
                {/* Horizontal ridges */}
                <path d="M 38 42 Q 50 40 58 42" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
                <path d="M 36 52 Q 50 50 60 52" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
                <path d="M 35 62 Q 50 60 60 62" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
                <path d="M 37 72 Q 50 70 58 72" stroke="#000" strokeWidth="1" opacity="0.1" fill="none" />
                
                {/* Highlight */}
                <ellipse cx="45" cy="45" rx="6" ry="12" fill="white" opacity="0.2" />
            </svg>
        ),
        corn: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Corn body */}
                <ellipse cx="50" cy="50" rx="22" ry="38" fill={color} />
                
                {/* Kernels in rows */}
                {[...Array(40)].map((_, i) => {
                    const row = Math.floor(i / 5);
                    const col = i % 5;
                    const x = 38 + col * 6;
                    const y = 25 + row * 7;
                    return <rect key={i} x={x} y={y} width="4" height="5" fill="#EED971" rx="1" />;
                })}
                
                {/* Husk leaves */}
                <path d="M 30 30 Q 20 25 18 20 Q 22 22 28 28" fill="#8BC34A" opacity="0.7" />
                <path d="M 70 30 Q 80 25 82 20 Q 78 22 72 28" fill="#7CB342" opacity="0.7" />
                <path d="M 25 45 Q 15 40 12 35 Q 17 38 23 43" fill="#9CCC65" opacity="0.6" />
                
                {/* Silk at top */}
                {[...Array(8)].map((_, i) => (
                    <line 
                        key={i} 
                        x1={48 + i} 
                        y1="15" 
                        x2={45 + i * 1.5} 
                        y2="8" 
                        stroke="#D4AF37" 
                        strokeWidth="0.8" 
                        opacity="0.6"
                    />
                ))}
            </svg>
        ),
        pepper: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Pepper body - elongated */}
                <path d="M 50 28 Q 38 32 35 45 Q 33 58 35 68 Q 38 78 45 82 Q 50 84 52 82 Q 58 78 60 68 Q 62 58 60 45 Q 58 32 50 28" fill={color} />
                
                {/* Stem and cap */}
                <ellipse cx="50" cy="28" rx="8" ry="4" fill="#4A7C4E" />
                <rect x="48" y="20" width="4" height="10" fill="#6B4423" rx="1" />
                
                {/* Shine/highlight */}
                <path d="M 45 40 Q 42 50 43 60" stroke="white" strokeWidth="3" opacity="0.3" fill="none" strokeLinecap="round" />
                
                {/* Texture */}
                <circle cx="48" cy="55" r="1" fill="#000" opacity="0.1" />
                <circle cx="52" cy="62" r="1" fill="#000" opacity="0.1" />
            </svg>
        ),
        mushroom: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Mushroom cap */}
                <ellipse cx="50" cy="45" rx="35" ry="25" fill={color} />
                <path d="M 15 45 Q 20 52 30 55 Q 50 58 70 55 Q 80 52 85 45" fill="#E8D4C0" />
                
                {/* Spots */}
                <circle cx="35" cy="35" r="4" fill="white" opacity="0.8" />
                <circle cx="50" cy="30" r="5" fill="white" opacity="0.8" />
                <circle cx="65" cy="35" r="4" fill="white" opacity="0.8" />
                <circle cx="42" cy="42" r="3" fill="white" opacity="0.8" />
                <circle cx="58" cy="42" r="3" fill="white" opacity="0.8" />
                
                {/* Stem */}
                <rect x="42" y="50" width="16" height="30" fill="#E8D4C0" rx="8" />
                
                {/* Highlight on cap */}
                <ellipse cx="40" cy="35" rx="12" ry="8" fill="white" opacity="0.2" />
            </svg>
        ),
        coconut: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Coconut body */}
                <circle cx="50" cy="50" r="32" fill={color} />
                
                {/* Texture - hairy fibers */}
                {[...Array(50)].map((_, i) => {
                    const angle = (i / 50) * Math.PI * 2;
                    const radius = 26 + Math.random() * 4;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 50 + Math.sin(angle) * radius;
                    return (
                        <line 
                            key={i} 
                            x1={cx} 
                            y1={cy} 
                            x2={cx + Math.cos(angle) * 3} 
                            y2={cy + Math.sin(angle) * 3} 
                            stroke="#6B4423" 
                            strokeWidth="0.5" 
                            opacity="0.6"
                        />
                    );
                })}
                
                {/* Three dots (coconut eyes) */}
                <circle cx="45" cy="42" r="3" fill="#4A3728" />
                <circle cx="55" cy="42" r="3" fill="#4A3728" />
                <circle cx="50" cy="52" r="3" fill="#4A3728" />
                
                {/* Highlight */}
                <ellipse cx="42" cy="40" rx="8" ry="10" fill="white" opacity="0.15" />
            </svg>
        ),
        blueberry: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Blueberry body */}
                <circle cx="50" cy="52" r="30" fill={color} />
                
                {/* Crown at top */}
                <path d="M 40 30 L 38 25 L 40 22 L 42 25 Z" fill="#2C3E50" />
                <path d="M 47 28 L 46 23 L 48 20 L 50 23 Z" fill="#2C3E50" />
                <path d="M 54 28 L 54 23 L 56 20 L 58 23 Z" fill="#2C3E50" />
                <path d="M 60 30 L 60 25 L 62 22 L 64 25 Z" fill="#2C3E50" />
                <circle cx="50" cy="27" r="6" fill="#34495E" />
                
                {/* Bloom (powdery coating) */}
                {[...Array(20)].map((_, i) => {
                    const angle = (i / 20) * Math.PI * 2;
                    const radius = 15 + Math.random() * 12;
                    const cx = 50 + Math.cos(angle) * radius;
                    const cy = 52 + Math.sin(angle) * radius;
                    return <circle key={i} cx={cx} cy={cy} r="1" fill="white" opacity="0.3" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="42" cy="45" rx="10" ry="12" fill="white" opacity="0.2" />
            </svg>
        ),
        eggplant: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Eggplant body */}
                <path d="M 50 35 Q 38 38 32 50 Q 28 62 32 72 Q 38 82 45 86 Q 50 88 55 86 Q 62 82 68 72 Q 72 62 68 50 Q 62 38 50 35" fill={color} />
                
                {/* Stem cap - star shape */}
                <path d="M 50 35 L 45 28 L 47 32 L 42 30 L 46 34 L 40 34 L 45 36 L 43 40 L 48 36 L 50 42 L 52 36 L 57 40 L 55 36 L 60 34 L 54 34 L 58 30 L 53 32 L 55 28 Z" fill="#4A7C4E" />
                
                {/* Stem */}
                <rect x="48" y="25" width="4" height="12" fill="#6B4423" rx="2" />
                
                {/* Shine */}
                <ellipse cx="42" cy="48" rx="8" ry="15" fill="white" opacity="0.25" />
            </svg>
        ),
        potato: (
            <svg viewBox="0 0 100 100" width={size} height={size}>
                {/* Potato body - irregular oval */}
                <ellipse cx="50" cy="50" rx="35" ry="28" fill={color} />
                <ellipse cx="48" cy="45" rx="30" ry="25" fill={color} />
                
                {/* Eyes/spots */}
                <ellipse cx="40" cy="45" rx="3" ry="2" fill="#8B6F47" />
                <ellipse cx="52" cy="42" rx="2.5" ry="2" fill="#8B6F47" />
                <ellipse cx="58" cy="50" rx="3" ry="2" fill="#8B6F47" />
                <ellipse cx="45" cy="55" rx="2" ry="1.5" fill="#8B6F47" />
                <ellipse cx="55" cy="58" rx="2.5" ry="2" fill="#8B6F47" />
                
                {/* Texture dots */}
                {[...Array(30)].map((_, i) => {
                    const x = 25 + Math.random() * 50;
                    const y = 30 + Math.random() * 40;
                    return <circle key={i} cx={x} cy={y} r="0.5" fill="#000" opacity="0.1" />;
                })}
                
                {/* Highlight */}
                <ellipse cx="40" cy="42" rx="12" ry="10" fill="white" opacity="0.15" />
            </svg>
        ),
    };

    // Default to apple if fruit type not found
    return illustrations[type] || illustrations.apple;
};

export default FruitIllustration;

