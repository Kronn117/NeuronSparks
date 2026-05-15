/**
 * Text Formatting Utilities
 * Functions for rich text formatting, markdown support, etc.
 */

/**
 * Apply bold formatting to text
 * Markdown style: **text**
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export const toBold = text => {
    if (!text || typeof text !== 'string') return '';
    return `**${text}**`;
};

/**
 * Apply italic formatting to text
 * Markdown style: *text*
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export const toItalic = text => {
    if (!text || typeof text !== 'string') return '';
    return `*${text}*`;
};

/**
 * Apply strikethrough formatting
 * Markdown style: ~~text~~
 * @param {string} text - Text to format
 * @returns {string} Formatted text
 */
export const toStrikethrough = text => {
    if (!text || typeof text !== 'string') return '';
    return `~~${text}~~`;
};

/**
 * Create a markdown link
 * Markdown style: [text](url)
 * @param {string} text - Display text
 * @param {string} url - URL
 * @returns {string} Formatted link
 */
export const toLink = (text, url) => {
    if (!text || !url) return text || '';
    return `[${text}](${url})`;
};

/**
 * Create a markdown code inline
 * Markdown style: `code`
 * @param {string} code - Code text
 * @returns {string} Formatted code
 */
export const toCode = code => {
    if (!code || typeof code !== 'string') return '';
    return `\`${code}\``;
};

/**
 * Create a markdown code block
 * Markdown style: ```code```
 * @param {string} code - Code text
 * @param {string} language - Programming language (optional)
 * @returns {string} Formatted code block
 */
export const toCodeBlock = (code, language = '') => {
    if (!code || typeof code !== 'string') return '';
    return `\`\`\`${language}\n${code}\n\`\`\``;
};

/**
 * Create a markdown heading
 * @param {string} text - Heading text
 * @param {number} level - Heading level (1-6)
 * @returns {string} Formatted heading
 */
export const toHeading = (text, level = 1) => {
    if (!text || typeof text !== 'string') return '';
    const hashes = '#'.repeat(Math.min(Math.max(level, 1), 6));
    return `${hashes} ${text}`;
};

/**
 * Create a markdown unordered list
 * @param {string[]} items - List items
 * @returns {string} Formatted list
 */
export const toUnorderedList = items => {
    if (!Array.isArray(items)) return '';
    return items.map(item => `- ${item}`).join('\n');
};

/**
 * Create a markdown ordered list
 * @param {string[]} items - List items
 * @returns {string} Formatted list
 */
export const toOrderedList = items => {
    if (!Array.isArray(items)) return '';
    return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
};

/**
 * Create a markdown blockquote
 * @param {string} text - Quote text
 * @returns {string} Formatted quote
 */
export const toBlockquote = text => {
    if (!text || typeof text !== 'string') return '';
    const lines = text.split('\n');
    return lines.map(line => `> ${line}`).join('\n');
};

/**
 * Create a markdown horizontal rule
 * @returns {string} Horizontal rule
 */
export const toHorizontalRule = () => {
    return '---';
};

/**
 * Strip markdown formatting from text
 * @param {string} text - Text with markdown
 * @returns {string} Plain text
 */
export const stripMarkdown = text => {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Remove links
        .replace(/^#+\s/gm, '') // Remove headings
        .replace(/^[-*]\s/gm, '') // Remove list bullets
        .replace(/^>\s/gm, ''); // Remove blockquotes
};

/**
 * Convert text to HTML for display
 * Basic markdown to HTML conversion
 * @param {string} text - Markdown text
 * @returns {string} HTML text
 */
export const markdownToHTML = text => {
    if (!text || typeof text !== 'string') return '';

    let html = text;

    // Convert code blocks first (before other conversions)
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Convert inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Convert links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    // Convert headings
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Convert blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Convert line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
};

/**
 * Highlight search query in text
 * @param {string} text - Text to search in
 * @param {string} query - Search query
 * @returns {string} Text with highlighted query
 */
export const highlightSearch = (text, query) => {
    if (!text || !query || typeof text !== 'string' || typeof query !== 'string') {
        return text || '';
    }

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '**$1**');
};

/**
 * Truncate text intelligently (at word boundaries)
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const smartTruncate = (text, maxLength = 100) => {
    if (!text || typeof text !== 'string' || text.length <= maxLength) {
        return text || '';
    }

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
};