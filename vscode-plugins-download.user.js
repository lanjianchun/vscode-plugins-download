// ==UserScript==
// @name         VSCode Plugin Downloader
// @name:zh-CN   VSCode 插件下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a download button to the VSCode Marketplace page for easy offline installation.
// @description:zh-CN 在 VSCode 插件市场页面添加下载按钮，方便离线安装。
// @author       You
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const i18n = {
        'en': {
            textLabel: 'Download Plugin',
            downloadVSIX: 'Download VSIX',
            errorMsg: 'Failed to create download button:'
        },
        'zh-CN': {
            textLabel: '下载插件',
            downloadVSIX: '下载 VSIX',
            errorMsg: '创建下载按钮失败：'
        }
    };

    const lang = navigator.language.startsWith('zh') ? 'zh-CN' : 'en';
    const texts = i18n[lang];

    window.addEventListener('load', function() {
        try {
            const versionEl = document.querySelector('td[aria-labelledby="version"]');
            const uniqueIdEl = document.querySelector('td[aria-labelledby="unique-identifier"]');

            if (versionEl && uniqueIdEl) {
                const version = versionEl.textContent.trim();
                const uniqueIdentifier = uniqueIdEl.textContent.trim();
                const [publisher, extension] = uniqueIdentifier.split('.');

                if (publisher && extension && version) {
                    const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;

                    // Floating Button
                    const container = document.createElement('div');
                    Object.assign(container.style, {
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        zIndex: '10000',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '8px'
                    });

                    const textLabel = document.createElement('div');
                    textLabel.textContent = texts.textLabel;
                    Object.assign(textLabel.style, {
                        color: 'black',
                        backgroundColor: 'white',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        opacity: '0',
                        transition: 'opacity 0.2s ease-in-out',
                        pointerEvents: 'none'
                    });

                    const downloadButton = document.createElement('a');
                    downloadButton.href = downloadUrl;
                    downloadButton.title = texts.downloadVSIX;

                    Object.assign(downloadButton.style, {
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#007aff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        textDecoration: 'none',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                    });

                    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    icon.setAttribute('width', '28');
                    icon.setAttribute('height', '28');
                    icon.setAttribute('viewBox', '0 0 24 24');
                    icon.setAttribute('fill', 'none');
                    icon.setAttribute('stroke', 'white');
                    icon.setAttribute('stroke-width', '2');
                    icon.setAttribute('stroke-linecap', 'round');
                    icon.setAttribute('stroke-linejoin', 'round');
                    icon.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>';

                    downloadButton.appendChild(icon);

                    container.addEventListener('mouseenter', () => {
                        textLabel.style.opacity = '1';
                        downloadButton.style.transform = 'scale(1.05)';
                        downloadButton.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                    });
                    container.addEventListener('mouseleave', () => {
                        textLabel.style.opacity = '0';
                        downloadButton.style.transform = 'scale(1)';
                        downloadButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    });

                    container.appendChild(textLabel);
                    container.appendChild(downloadButton);
                    document.body.appendChild(container);

                    // Static Button under More Info
                    const infoTable = versionEl.closest('table');
                    if (infoTable) {
                        const newDownloadButton = document.createElement('a');
                        newDownloadButton.href = downloadUrl;
                        newDownloadButton.textContent = texts.downloadVSIX;
                        newDownloadButton.title = texts.downloadVSIX;

                        Object.assign(newDownloadButton.style, {
                            display: 'inline-block',
                            marginTop: '16px',
                            padding: '10px 20px',
                            backgroundColor: '#007aff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        });

                        infoTable.parentNode.insertBefore(newDownloadButton, infoTable.nextSibling);
                    }
                }
            }
        } catch (e) {
            console.error(texts.errorMsg, e);
        }
    });
})();