const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const crypto = require('crypto');

const ANALYSIS_PROMPT = `You are an expert email designer. Analyze this email design and extract its complete structure as a JSON array of blocks, top to bottom.

Return ONLY a valid JSON array. No markdown, no explanation, no code fences. Just the raw JSON array.

Each block must follow one of these exact shapes:

LOGO: {"type":"logo","props":{"src":"placeholder","alt":"Company Logo","link":"","logoWidth":"180px","align":"center","bgColor":"#ffffff","paddingTop":"20px","paddingBottom":"20px","paddingLeft":"20px","paddingRight":"20px","description":"describe the logo style and colors"}}

TITLE: {"type":"title","props":{"content":"exact headline text","fontFamily":"global","color":"#hex","fontSize":"28px","fontWeight":"700","align":"center","bgColor":"","paddingTop":"16px","paddingBottom":"16px","paddingLeft":"16px","paddingRight":"16px"}}

TEXT: {"type":"text","props":{"content":"<p>exact HTML</p>","fontFamily":"global","color":"#hex","fontSize":"15px","lineHeight":"1.6","align":"left","bgColor":"","paddingTop":"8px","paddingBottom":"8px","paddingLeft":"16px","paddingRight":"16px"}}

IMAGE: {"type":"image","props":{"src":"placeholder","alt":"description of image","link":"","width":"100%","align":"center","bgColor":"","paddingTop":"0px","paddingBottom":"0px","paddingLeft":"0px","paddingRight":"0px","description":"detailed description of image content"}}

BUTTON: {"type":"button","props":{"label":"button text","href":"#","bgColor":"#hex","textColor":"#ffffff","borderRadius":"6px","fontSize":"14px","fontWeight":"600","align":"center","btnPaddingV":"12px","btnPaddingH":"28px","blockBgColor":"","paddingTop":"16px","paddingBottom":"16px","paddingLeft":"16px","paddingRight":"16px"}}

COLUMNS: {"type":"columns","props":{"bgColor":"","paddingTop":"16px","paddingBottom":"16px","paddingLeft":"8px","paddingRight":"8px","columns":[{"width":"50%","content":"<p>HTML</p>","color":"#374151","fontSize":"14px"}]}}

DIVIDER: {"type":"divider","props":{"color":"#e5e7eb","thickness":"1px","bgColor":"","paddingTop":"10px","paddingBottom":"10px","paddingLeft":"16px","paddingRight":"16px"}}

SPACER: {"type":"spacer","props":{"height":"30px","bgColor":""}}

SOCIAL: {"type":"social","props":{"align":"center","bgColor":"","iconSize":"32px","paddingTop":"16px","paddingBottom":"16px","paddingLeft":"16px","paddingRight":"16px","links":[{"platform":"facebook","href":"#","label":"Facebook"}]}}
Social platforms: facebook, twitter, instagram, linkedin, youtube, pinterest, github

VIDEO: {"type":"video","props":{"videoUrl":"","thumbnailSrc":"placeholder","alt":"Watch Video","bgColor":"","paddingTop":"0px","paddingBottom":"0px","paddingLeft":"0px","paddingRight":"0px","description":"describe the video thumbnail"}}

Rules:
1. Extract ALL visible sections — be thorough
2. Use exact hex colors
3. Extract ALL text verbatim
4. Images/logos: set src to "placeholder", describe in alt/description
5. Return ONLY the JSON array`;

async function analyzeEmailDesign(file, apiKey) {
  const key = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!key || key === 'your_api_key_here') {
    throw new Error('Anthropic API key not set. Enter your key in Settings → API Key.');
  }

  const client = new Anthropic({ apiKey: key });
  const fileBuffer = fs.readFileSync(file.path);
  const base64 = fileBuffer.toString('base64');
  const isPDF = file.mimetype === 'application/pdf';

  const mediaContent = isPDF
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
    : { type: 'image', source: { type: 'base64', media_type: file.mimetype, data: base64 } };

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: [mediaContent, { type: 'text', text: ANALYSIS_PROMPT }] }],
  });

  const text = response.content[0].text.trim();
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI did not return a valid JSON array. Try again.');

  const blocks = JSON.parse(match[0]);
  return blocks.map(b => ({
    ...b,
    id: crypto.randomBytes(5).toString('hex'),
    props: b.props || {},
  }));
}

module.exports = { analyzeEmailDesign };
