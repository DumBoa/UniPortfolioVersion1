// export.js - File riêng cho chức năng export HTML
// Giả sử project object có cấu trúc như trong script chính

function getBlockContent(block) {
    // Helper function để render content của từng block (copy từ script chính)
    switch (block.type) {
        case 'text':
            return `<div class="text-block" style="font-size: ${block.props.fontSize}px; color: ${block.props.color}; font-weight: ${block.props.fontWeight || 'normal'}; text-align: ${block.props.textAlign || 'left'}; line-height: ${block.props.lineHeight || '1.4'}; padding: 8px;">${block.props.content}</div>`;
        case 'image':
            if (block.props.src) {
                return `<div style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: ${block.props.borderRadius || 0}px;">
                    <img src="${block.props.src}" alt="${block.props.alt}" style="width: 100%; height: 100%; object-fit: ${block.props.objectFit || 'cover'}; opacity: ${block.props.opacity || 1};">
                    ${block.props.overlay ? `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${block.props.overlayColor || 'rgba(0,0,0,0.3)'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">${block.props.overlayText || ''}</div>` : ''}
                </div>`;
            } else {
                return `<div class="upload-placeholder" style="background: #f0f0f0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border: 2px dashed #ddd; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
                    <div>Click để upload ảnh</div>
                    <div style="font-size: 12px; margin-top: 4px;">hoặc kéo thả file vào đây</div>
                </div>`;
            }
        // Thêm các case khác nếu cần (photogrid, video, etc.) - copy từ script chính để đầy đủ
        case 'photogrid':
            const gridImages = block.props.images || [];
            const totalSlots = block.props.columns * Math.ceil(4 / block.props.columns);
            return `<div style="display: grid; grid-template-columns: repeat(${block.props.columns}, 1fr); gap: 4px; height: 100%;">
                ${Array(totalSlots).fill(0).map((_, index) => {
                const image = gridImages[index];
                return image ?
                    `<div style="background: url('${image.src}') center/cover; aspect-ratio: 1; border-radius: 4px; position: relative; cursor: pointer;" onclick="editGridImage('${block.id}', ${index})">
                            <div style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;" onclick="removeGridImage('${block.id}', ${index}); event.stopPropagation();">×</div>
                        </div>` :
                    `<div style="background: #f0f0f0; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666; border: 2px dashed #ddd; border-radius: 4px; cursor: pointer; font-size: 24px;" onclick="addGridImage('${block.id}', ${index})">+</div>`;
            }).join('')}
            </div>`;
        case 'video':
            if (block.props.src) {
                if (block.props.src.includes('youtube.com') || block.props.src.includes('youtu.be')) {
                    const videoId = extractYouTubeId(block.props.src);
                    return `<iframe src="https://www.youtube.com/embed/${videoId}${block.props.autoplay ? '?autoplay=1' : ''}" frameborder="0" allowfullscreen style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 0}px;"></iframe>`;
                } else if (block.props.src.includes('vimeo.com')) {
                    const videoId = block.props.src.split('/').pop();
                    return `<iframe src="https://player.vimeo.com/video/${videoId}${block.props.autoplay ? '?autoplay=1' : ''}" frameborder="0" allowfullscreen style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 0}px;"></iframe>`;
                } else {
                    return `<video ${block.props.autoplay ? 'autoplay' : ''} ${block.props.loop ? 'loop' : ''} ${block.props.muted ? 'muted' : ''} controls style="width: 100%; height: 100%; object-fit: cover; border-radius: ${block.props.borderRadius || 0}px;">
                        <source src="${block.props.src}" type="video/mp4">
                        Trình duyệt không hỗ trợ video.
                    </video>`;
                }
            } else {
                return `<div class="upload-placeholder" style="background: #f0f0f0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border: 2px dashed #ddd; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🎥</div>
                    <div>Click để upload video</div>
                    <div style="font-size: 12px; margin-top: 4px;">hoặc nhập YouTube/Vimeo URL</div>
                </div>`;
            }
        case 'embed':
            if (block.props.code && block.props.code.trim() !== '<p>Embed code here</p>') {
                return `<div style="width: 100%; height: 100%; overflow: hidden; border-radius: ${block.props.borderRadius || 0}px;">
                    <iframe srcdoc="${block.props.code.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; border: none;" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>`;
            } else {
                return `<div class="embed-placeholder" style="background: #f8f9fa; padding: 16px; border: 2px dashed #ddd; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🔗</div>
                    <div>Click để thêm embed code</div>
                    <div style="font-size: 12px; margin-top: 4px;">HTML, iframe, hoặc script</div>
                </div>`;
            }
        case 'prototype':
            if (block.props.src) {
                return `<div style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 8}px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <iframe src="${block.props.src}" style="width: 100%; height: 100%; border: none;" title="${block.props.title}"></iframe>
                </div>`;
            } else {
                return `<div class="prototype-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; cursor: pointer; border-radius: 8px; position: relative;">
                    <div style="font-size: 48px; margin-bottom: 12px;">📱</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${block.props.title}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Click để thêm prototype link</div>
                    <div style="position: absolute; bottom: 8px; right: 8px; font-size: 10px; opacity: 0.6;">Prototype</div>
                </div>`;
            }
        default:
            return `<div>${block.type}</div>`;
    }
}

function extractYouTubeId(url) {
    // Helper cho video YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Function chính: Generate HTML export
function generateHTMLExport(project) {
    // Phần 1: Tạo HTML cho các blocks
    let blocksHTML = '';
    if (project && project.blocks) {
        blocksHTML = project.blocks.map(function (block) {
            let blockStyle = `position: absolute; left: ${block.x}px; top: ${block.y}px; width: ${block.w}px; height: ${block.h}px; z-index: ${block.z};`;
            return `<div style="${blockStyle}">${getBlockContent(block)}</div>`;
        }).join('');
    }

    // Phần 2: Tạo nội dung script riêng (JSON stringify project để embed data)
    let scriptContent = `window.portfolioData = ${JSON.stringify(project || {})};`;

    // Phần 3: Build HTML từng phần (sử dụng template literals để tránh lỗi concat)
    return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project ? project.title : 'Untitled'}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: ${project && project.styles && project.styles.global ? project.styles.global.fontFamily : 'Arial, sans-serif'};
            background-color: ${project && project.styles && project.styles.global ? project.styles.global.backgroundColor : '#ffffff'};
            color: ${project && project.styles && project.styles.global ? project.styles.global.textColor : '#333333'};
        }
        .portfolio-container {
            position: relative;
            width: 1200px;
            height: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
            .portfolio-container {
                width: 100%;
                height: auto;
                min-height: 600px;
            }
        }
    </style>
</head>
<body>
    <div class="portfolio-container">
        ${blocksHTML}
    </div>
    <script>
        ${scriptContent}
    </script>
</body>
</html>`;
}

// Export cho module (nếu dùng import/export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateHTMLExport };
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return { generateHTMLExport }; });
} else {
    window.generateHTMLExport = generateHTMLExport;  // Global cho browser
}
// export.js - File riêng cho chức năng export HTML
// Giả sử project object có cấu trúc như trong script chính

// Helper functions (copy từ script chính để độc lập)
function normalizeColor(color) {
    if (!color) return '#000000';
    if (color.startsWith('rgba(')) {
        // Extract RGB from rgba, convert to hex (alpha ignored for picker/export)
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const toHex = (n) => `0${parseInt(n).toString(16)}`.slice(-2);
            return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
        }
    }
    if (color.startsWith('#') && color.length === 4) {
        // Expand shorthand #rgb to #rrggbb
        const r = color[1] + color[1], g = color[2] + color[2], b = color[3] + color[3];
        return `#${r}${g}${b}`;
    }
    return color; // Assume valid #rrggbb
}

function hexToRgb(hex) {
    hex = normalizeColor(hex); // Ensure full hex
    const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getBlockContent(block) {
    // Helper function để render content của từng block (copy từ script chính, với normalize color)
    switch (block.type) {
        case 'text':
            return `<div class="text-block" style="font-size: ${block.props.fontSize}px; color: ${normalizeColor(block.props.color)}; font-weight: ${block.props.fontWeight || 'normal'}; text-align: ${block.props.textAlign || 'left'}; line-height: ${block.props.lineHeight || '1.4'}; padding: 8px;">${block.props.content}</div>`;
        case 'image':
            if (block.props.src) {
                return `<div style="width: 100%; height: 100%; position: relative; overflow: hidden; border-radius: ${block.props.borderRadius || 0}px;">
                    <img src="${block.props.src}" alt="${block.props.alt}" style="width: 100%; height: 100%; object-fit: ${block.props.objectFit || 'cover'}; opacity: ${block.props.opacity || 1};">
                    ${block.props.overlay ? `<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${block.props.overlayColor || 'rgba(0,0,0,0.3)'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">${block.props.overlayText || ''}</div>` : ''}
                </div>`;
            } else {
                return `<div class="upload-placeholder" style="background: #f0f0f0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border: 2px dashed #ddd; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
                    <div>Click để upload ảnh</div>
                    <div style="font-size: 12px; margin-top: 4px;">hoặc kéo thả file vào đây</div>
                </div>`;
            }
        case 'photogrid':
            const gridImages = block.props.images || [];
            const totalSlots = block.props.columns * Math.ceil(4 / block.props.columns);
            return `<div style="display: grid; grid-template-columns: repeat(${block.props.columns}, 1fr); gap: 4px; height: 100%;">
                ${Array(totalSlots).fill(0).map((_, index) => {
                const image = gridImages[index];
                return image ?
                    `<div style="background: url('${image.src}') center/cover; aspect-ratio: 1; border-radius: 4px; position: relative; cursor: pointer;">
                            <div style="position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;">×</div>
                        </div>` :
                    `<div style="background: #f0f0f0; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; color: #666; border: 2px dashed #ddd; border-radius: 4px; cursor: pointer; font-size: 24px;">+</div>`;
            }).join('')}
            </div>`;
        case 'video':
            if (block.props.src) {
                if (block.props.src.includes('youtube.com') || block.props.src.includes('youtu.be')) {
                    const videoId = extractYouTubeId(block.props.src);
                    return `<iframe src="https://www.youtube.com/embed/${videoId}${block.props.autoplay ? '?autoplay=1' : ''}" frameborder="0" allowfullscreen style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 0}px;"></iframe>`;
                } else if (block.props.src.includes('vimeo.com')) {
                    const videoId = block.props.src.split('/').pop();
                    return `<iframe src="https://player.vimeo.com/video/${videoId}${block.props.autoplay ? '?autoplay=1' : ''}" frameborder="0" allowfullscreen style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 0}px;"></iframe>`;
                } else {
                    return `<video ${block.props.autoplay ? 'autoplay' : ''} ${block.props.loop ? 'loop' : ''} ${block.props.muted ? 'muted' : ''} controls style="width: 100%; height: 100%; object-fit: cover; border-radius: ${block.props.borderRadius || 0}px;">
                        <source src="${block.props.src}" type="video/mp4">
                        Trình duyệt không hỗ trợ video.
                    </video>`;
                }
            } else {
                return `<div class="upload-placeholder" style="background: #f0f0f0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border: 2px dashed #ddd; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🎥</div>
                    <div>Click để upload video</div>
                    <div style="font-size: 12px; margin-top: 4px;">hoặc nhập YouTube/Vimeo URL</div>
                </div>`;
            }
        case 'embed':
            if (block.props.code && block.props.code.trim() !== '<p>Embed code here</p>') {
                return `<div style="width: 100%; height: 100%; overflow: hidden; border-radius: ${block.props.borderRadius || 0}px;">
                    <iframe srcdoc="${block.props.code.replace(/"/g, '&quot;')}" style="width: 100%; height: 100%; border: none;" sandbox="allow-scripts allow-same-origin"></iframe>
                </div>`;
            } else {
                return `<div class="embed-placeholder" style="background: #f8f9fa; padding: 16px; border: 2px dashed #ddd; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; cursor: pointer; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 8px;">🔗</div>
                    <div>Click để thêm embed code</div>
                    <div style="font-size: 12px; margin-top: 4px;">HTML, iframe, hoặc script</div>
                </div>`;
            }
        case 'prototype':
            if (block.props.src) {
                return `<div style="width: 100%; height: 100%; border-radius: ${block.props.borderRadius || 8}px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <iframe src="${block.props.src}" style="width: 100%; height: 100%; border: none;" title="${block.props.title}"></iframe>
                </div>`;
            } else {
                return `<div class="prototype-placeholder" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; cursor: pointer; border-radius: 8px; position: relative;">
                    <div style="font-size: 48px; margin-bottom: 12px;">📱</div>
                    <div style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">${block.props.title}</div>
                    <div style="font-size: 12px; opacity: 0.8;">Click để thêm prototype link</div>
                    <div style="position: absolute; bottom: 8px; right: 8px; font-size: 10px; opacity: 0.6;">Prototype</div>
                </div>`;
            }
        default:
            return `<div>${block.type}</div>`;
    }
}

// Function chính: Generate HTML export (với try-catch và fallback cho lỗi stringify)
function generateHTMLExport(project) {
    try {
        // Phần 1: Tạo HTML cho các blocks
        let blocksHTML = '';
        if (project && project.blocks) {
            blocksHTML = project.blocks.map(function (block) {
                let blockStyle = `position: absolute; left: ${block.x}px; top: ${block.y}px; width: ${block.w}px; height: ${block.h}px; z-index: ${block.z};`;
                return `<div style="${blockStyle}">${getBlockContent(block)}</div>`;
            }).join('');
        }

        // Phần 2: Tạo nội dung script riêng (JSON stringify project để embed data, nhưng chỉ blocks nếu lớn)
        let scriptContent = '';
        try {
            // Kiểm tra kích thước trước stringify
            const tempState = { ...project, history: [], assets: [] }; // Loại bỏ history/assets để giảm size
            const stateStr = JSON.stringify(tempState);
            if (stateStr.length > 5e6) { // ~5MB threshold
                throw new Error('Project too large');
            }
            scriptContent = `window.portfolioData = ${stateStr};`;
        } catch (stringifyErr) {
            console.warn('Project too large for full embed; exporting blocks only:', stringifyErr);
            scriptContent = `window.portfolioData = { blocks: ${JSON.stringify(project.blocks || [])} };`; // Fallback: chỉ blocks
        }

        // Phần 3: Build HTML từng phần
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project ? project.title : 'Untitled'}</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: ${project && project.styles && project.styles.global ? project.styles.global.fontFamily : 'Arial, sans-serif'};
            background-color: ${normalizeColor(project && project.styles && project.styles.global ? project.styles.global.backgroundColor : '#ffffff')};
            color: ${normalizeColor(project && project.styles && project.styles.global ? project.styles.global.textColor : '#333333')};
        }
        .portfolio-container {
            position: relative;
            width: 1200px;
            height: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        @media (max-width: 768px) {
            .portfolio-container {
                width: 100%;
                height: auto;
                min-height: 600px;
            }
        }
    </style>
</head>
<body>
    <div class="portfolio-container">
        ${blocksHTML}
    </div>
    <script>
        ${scriptContent}
    </script>
</body>
</html>`;
    } catch (e) {
        console.error('Export failed:', e);
        return `<!DOCTYPE html><html><body><h1>Export failed: ${e.message}. Try JSON export instead.</h1></body></html>`;
    }
}

// Export cho module (nếu dùng import/export)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateHTMLExport };
} else if (typeof define === 'function' && define.amd) {
    define([], function() { return { generateHTMLExport }; });
} else {
    window.generateHTMLExport = generateHTMLExport;  // Global cho browser
}