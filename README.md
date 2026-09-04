# Guardian AI

Build a production-quality AI Cybersecurity Web Application called:

"AI Email Threat Detection & Fraud Link Analyzer"

Purpose:

Create an intelligent security platform that helps users detect phishing emails, malicious links, scams, and cyber threats using AI analysis.

The application should have a premium cybersecurity dashboard design inspired by modern security platforms.

Tech Stack:

- React + TypeScript

- Tailwind CSS

- Modern responsive UI

- Dark theme by default

- Clean animations

- Component-based architecture

========================

MAIN FEATURES

========================

1. Landing Page

Create a professional cybersecurity landing page.

Hero Section:

Heading:

"AI-Powered Email Threat Detection"

Subheading:

"Detect phishing, malicious links, scams and cyber threats before they harm you."

Buttons:

- Scan Email

- Check Suspicious Link

Add:

- Cybersecurity background graphics

- AI brain/security icons

- Trust indicators

- Threat statistics cards

========================

2. AI Email Scanner

========================

Create an Email Analysis page.

Input options:

- Paste email content

- Upload email file

- Enter sender email

- Enter subject

After scanning show:

AI Security Report Card:

Threat Category:

(Phishing Attack / Safe Email / Spam / Spoofing / Financial Scam / Malicious Attachment)

Threat Score:

0-100

Risk Level:

Green:

LOW RISK

Yellow:

MEDIUM RISK

Red:

HIGH RISK

Show:

Reason:

Explain why AI detected this risk.

Detected Indicators:

Example:

✓ Suspicious domain

✓ Urgency language

✓ Fake identity

✓ Credential request

Recommended Action:

Examples:

"Safe to open"

"Open with caution"

"Block and report"

========================

3. Fraud Link Detector

========================

Create a URL scanner page.

Input:

Paste suspicious URL

Example:

https://example.com

After analysis show:

URL Security Report:

Domain Name

Domain Age

SSL Status

Blacklist Status

Threat Score

Risk Level

Visual Result:

SAFE:

Green shield animation

SUSPICIOUS:

Yellow warning

DANGEROUS:

Red alert

========================

4. AI Threat Dashboard

========================

Create admin dashboard.

Show cards:

Total Emails Scanned

Threats Detected

Safe Emails

Blocked Threats

Charts:

Threat Detection Analytics

Risk Distribution:

Low Risk

Medium Risk

High Risk

Recent Threat Logs:

Table:

Date

Sender

Category

Score

Risk

Action

========================

5. AI Analysis Engine UI

========================

Create an AI processing animation:

Steps:

1. Extracting Email Data

2. Checking Domain Reputation

3. Analyzing Text Using NLP

4. Detecting Phishing Patterns

5. Generating Threat Score

Show progress animation.

========================

6. Threat Categories Page

========================

Create cards for:

1. Safe Email

Description:

Normal communication without suspicious indicators.

2. Phishing Attack

Description:

Attempts to steal passwords, OTPs or sensitive information.

3. Social Engineering

Description:

Uses urgency, fear or manipulation.

4. Malicious Link

Description:

Contains harmful or suspicious URLs.

5. Malicious Attachment

Description:

Contains dangerous files.

6. Spoofing

Description:

Fake sender identity or impersonation.

7. Financial Scam

Description:

Fake payments, rewards or money fraud.

8. Spam

Description:

Unwanted promotional emails.

========================

7. Report Generation

========================

Create downloadable security report UI.

Report contains:

Threat Summary

AI Decision

Risk Score

Detected Problems

Safety Recommendations

========================

8. n8n Integration

========================

Prepare API integration structure.

Create service file:

src/services/api.ts

Add placeholder:

POST /analyze-email

POST /scan-url

Expected response:

{

 category:"",

 threat_score:0,

 risk_level:"",

 reason:"",

 recommended_action:""

}

========================

DESIGN REQUIREMENTS

========================

Theme:

Dark cybersecurity theme

Colors:

Black background

Blue/Purple AI glow

Green safe indicators

Yellow warning

Red danger

Add:

- Glassmorphism cards

- Smooth hover effects

- Modern navbar

- Sidebar dashboard

- Responsive mobile design

Navbar:

Logo:

"ThreatGuard AI"

Links:

Home

Email Scanner

Link Scanner

Dashboard

Reports

Footer:

Cybersecurity information

Privacy

Contact

========================

IMPORTANT

========================

The website should feel like a real AI security product, not a simple template.

Focus on:

- Premium UI

- Clear data visualization

- AI trust experience

- Professional SIH demonstration quality

Generate complete frontend with reusable components.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0198fbe8-a5cf-419e-a200-465f26966fae).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
