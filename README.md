# StudyEazy AI

Build a complete, production-quality, fully functional web application called:

STUDYEAZY AI

Tagline:

STUDY SMART. PASS EAZY.

StudyEazy AI is an AI-powered matric study assistant designed primarily for South African Grade 12 learners.

IMPORTANT:

This must NOT be a static UI prototype.

Build a real working application where every major button, navigation item, form, AI feature, study workflow, progress feature, and user interaction actually works.

Do not create placeholder buttons.

Do not use fake AI responses.

Do not create dead navigation links.

Do not simulate functionality that should be implemented.

If an AI API is required, structure the application so the API can be connected securely through server-side/backend functions and environment variables.

==================================================

1. BRAND IDENTITY

==================================================

Application name:

StudyEazy AI

Tagline:

STUDY SMART. PASS EAZY.

The application logo must use:

"SE"

NOT "WE".

The logo should visually communicate:

- S in deep navy

- E in gold/yellow

- subtle blue/pink accent elements

- modern AI/education aesthetic

- premium SaaS appearance

Use the uploaded/approved StudyEazy logo as the primary brand reference where available.

Do not display the WorkEazy "WE" logo anywhere in the application.

The application must consistently say:

StudyEazy AI

Never:

WorkEazy

WorkEazy AI

WE

==================================================

2. COLOR SYSTEM

==================================================

Use the same visual color direction as the approved dashboard reference.

PRIMARY NAVY:

#031A45

SECONDARY NAVY:

#06255C

BLUE:

#1769FF

BRIGHT BLUE:

#278BFF

PINK:

#FF1685

HOT PINK:

#FF2B91

GOLD:

#FFB819

LIGHT GOLD:

#FFF4D6

LIGHT BLUE:

#EEF6FF

LIGHT PINK:

#FFF0F7

LIGHT GREY:

#F3F5F8

BORDER:

#DCE3ED

WHITE:

#FFFFFF

BACKGROUND:

#F8FAFD

Use navy for the main sidebar and strong text.

Use blue for primary AI/productivity elements.

Use pink for primary calls-to-action, active dashboard states, and important interactive elements.

Use gold for highlights, achievements, progress accents, and secondary emphasis.

Use light blue, light pink, and light gold as subtle card/icon backgrounds.

Maintain a premium visual balance.

Do not make the application overwhelmingly pink.

Do not use random colors.

Do not introduce purple as a dominant brand color.

==================================================

3. TYPOGRAPHY

==================================================

Use Inter, Manrope, or another premium modern sans-serif.

Typography must be highly readable.

Do NOT use faint text.

Headings:

700–800 weight

Subheadings:

600–700

Body:

400–500

Buttons:

600–700

Important information must have strong contrast.

Use generous spacing and clean typography.

==================================================

4. APPLICATION STRUCTURE

==================================================

Create this application structure:

STUDYEAZY AI

├── Authentication

│   ├── Landing Page

│   ├── Sign Up

│   ├── Login

│   └── Forgot Password

│

├── Main Application

│   ├── Dashboard

│   ├── AI Study Guide

│   ├── Notes Summarizer

│   ├── AI Study Planner

│   ├── Subject Tutor

│   ├── AI Assistant

│   ├── AI Quiz Generator

│   ├── Past Paper Assistant

│   ├── Subjects

│   ├── Progress

│   ├── Profile

│   └── Settings

│

└── Supporting functionality

    ├── Notifications

    ├── Search

    ├── Saved Content

    ├── Recent Activity

    └── Error Handling

==================================================

5. AUTHENTICATION

==================================================

Create a functional authentication system.

Users must be able to:

- Create an account

- Log in

- Log out

- Reset password

- Remain logged in between sessions

- Access their personal dashboard

During registration collect:

- First name

- Last name

- Email

- Password

- Grade

- School/learning institution (optional)

- Subjects

Default grade:

Grade 12 / Matric

Allow users to update their subjects later.

Never expose passwords.

Use secure authentication.

==================================================

6. MAIN DASHBOARD LAYOUT

==================================================

The dashboard must closely follow the approved reference layout.

Desktop structure:

LEFT SIDEBAR

+

TOP HEADER

+

MAIN CONTENT AREA

--------------------------------------------------

LEFT SIDEBAR

--------------------------------------------------

Width:

approximately 270px

Height:

100vh

Background:

Deep Navy #031A45

At the top display:

SE

StudyEazy AI

STUDY SMART. PASS EAZY.

The logo must say SE.

Under the logo:

MAIN

Navigation:

Dashboard

AI Study Guide

Notes Summarizer

AI Study Planner

Subject Tutor

AI Assistant

AI Quiz Generator

Past Paper Assistant

Subjects

Progress

Then:

OTHER

Settings

Help & Support

At the bottom display the logged-in learner:

Profile avatar

[Student Name]

Matric Learner

Dropdown arrow

The sidebar must scroll if necessary.

The active page must have a bright pink rounded background.

Inactive navigation should use white/light text.

Hover states should use subtle blue/pink transparency.

Every navigation item must actually navigate to its page.

--------------------------------------------------

TOP HEADER

--------------------------------------------------

White background.

Bottom border.

Left:

Hamburger/menu icon.

Then an AI responsibility notice:

"AI-generated content may require human review."

Right:

Theme toggle

Notifications

Notification badge

User avatar

Dropdown

The controls must work.

--------------------------------------------------

7. DASHBOARD HERO

--------------------------------------------------

Create a large rounded hero card.

Background:

Very light blue/pink gradient.

Border radius:

20–24px.

Left side:

Small label:

✦ Powered by AI

Headline:

Your AI Matric Study Assistant

Use:

"AI" in blue.

"Assistant" in pink.

Description:

"Learn smarter, revise faster, and prepare with confidence — all from one simple study workspace."

Buttons:

START STUDYING →

ASK AI TUTOR

Primary button:

Pink

Secondary button:

White with blue/navy border

Right side:

Display the official SE StudyEazy logo.

Do NOT display WE.

Add subtle decorative AI/education elements.

==================================================

8. DASHBOARD STATISTICS

==================================================

Create three dynamic statistics cards.

Card 1:

[NUMBER]

Study Sessions Completed

Card 2:

[NUMBER]

Study Time This Week

Card 3:

[NUMBER]%

Revision Progress

These values must be connected to actual user activity.

Do NOT permanently hard-code fake statistics.

For a new user show:

0

Study Sessions

0h

Study Time

0%

Revision Progress

As the learner uses the application, update the values.

==================================================

9. AI STUDY TOOLS

==================================================

Heading:

AI Study Tools

Subtitle:

Choose a tool to help you study smarter.

Create polished responsive cards.

The main dashboard should show:

1. AI Study Guide

2. Notes Summarizer

3. AI Study Planner

4. Subject Tutor

5. AI Assistant

6. AI Quiz Generator

7. Past Paper Assistant

Each card must have:

- Icon

- Title

- Description

- Open Tool button

- Hover effect

- Working navigation

==================================================

10. AI STUDY GUIDE

==================================================

Purpose:

Turn a matric topic into a structured study guide.

Inputs:

Subject

Topic

Difficulty

Study time

Preferred learning style

Subjects should support common South African matric subjects such as:

- Mathematics

- Mathematical Literacy

- Physical Sciences

- Life Sciences

- Accounting

- Business Studies

- Economics

- Geography

- History

- English

- Afrikaans

- Computer Applications Technology

- Information Technology

- Other

Allow the learner to add their own subject if necessary.

Difficulty:

Beginner

Intermediate

Advanced

Exam Preparation

Learning style:

Simple Explanation

Detailed Explanation

Examples

Step-by-Step

Exam Focused

Button:

GENERATE STUDY GUIDE

The AI must generate:

1. Topic Overview

2. Key Concepts

3. Important Definitions

4. Important Formulas where applicable

5. Step-by-Step Explanation

6. Worked Examples

7. Common Mistakes

8. Exam Tips

9. Practice Questions

10. Quick Revision Summary

Allow:

Copy

Save

Regenerate

Print

Download

Saved study guides must appear under Saved Content.

==================================================

11. NOTES SUMMARIZER

==================================================

Create a functional notes summarization tool.

Allow users to:

- Paste notes

- Type notes

- Upload supported text/document files where technically available

Input:

"Paste your notes here..."

Controls:

Summary Length:

Short

Medium

Detailed

Study Level:

Simple

Matric

Exam Focused

Button:

SUMMARIZE NOTES

Output:

SUMMARY

KEY CONCEPTS

IMPORTANT DEFINITIONS

IMPORTANT FACTS

FORMULAS

EXAMPLES

POSSIBLE EXAM QUESTIONS

QUICK REVISION

Allow:

Edit

Copy

Save

Regenerate

Download

The system must preserve important information and should not deliberately remove critical details.

==================================================

12. AI STUDY PLANNER

==================================================

Create a fully functional personalized study planner.

Inputs:

Subjects

Topics

Exam dates

Available study hours

Preferred study times

Current strengths

Weak subjects

Study days

Break preferences

Allow multiple exams.

The AI must create a realistic schedule.

Example:

MONDAY

16:00–17:00

Mathematics

Trigonometry

17:15–18:00

Physical Sciences

Waves

19:00–19:30

English

Essay Practice

Each planned session must contain:

Subject

Topic

Start time

End time

Duration

Priority

Completion status

Allow learners to:

Add task

Edit task

Delete task

Mark complete

Move task

Regenerate plan

Automatically update progress when tasks are completed.

Do not create impossible schedules.

Include breaks.

Do not schedule overlapping sessions.

==================================================

13. SUBJECT TUTOR

==================================================

Create a dedicated AI tutor.

The learner selects:

Subject

Topic

Difficulty

Then asks:

"Explain this topic."

The AI should teach rather than simply provide answers.

Responses should include:

Simple Explanation

Step-by-Step Breakdown

Example

Practice Question

Hint

Answer

Common Mistakes

The tutor should encourage the learner to attempt questions before revealing the final answer where appropriate.

Add buttons:

Explain Simpler

Give Example

Give Hint

Quiz Me

Show Solution

The learner must be able to continue asking follow-up questions.

==================================================

14. AI ASSISTANT

==================================================

Create a conversational AI study assistant.

The learner can ask:

"Help me study for Maths."

"Explain photosynthesis."

"Quiz me on World War II."

"Create a revision plan."

"I don't understand this equation."

The assistant should remember the current conversation context.

Provide suggested prompts:

Explain a topic

Create a quiz

Help with homework

Make a study plan

Summarize notes

Prepare me for an exam

Include:

New Chat

Clear Chat

Copy Response

Save Response

Display:

"AI-generated content may require human review."

==================================================

15. AI QUIZ GENERATOR

==================================================

Create a fully functional quiz generator.

Inputs:

Subject

Topic

Number of questions

Difficulty

Question type

Question types:

Multiple Choice

True/False

Short Answer

Mixed

Button:

GENERATE QUIZ

Generate questions based on the selected subject/topic.

Display one question at a time or in a structured quiz.

Allow:

Next

Previous

Submit

Restart

After submission calculate:

Score

Percentage

Correct Answers

Incorrect Answers

Then show:

STRENGTHS

WEAK AREAS

RECOMMENDED REVISION

Example:

Score:

8/10

80%

Weak area:

Quadratic equations

Recommendation:

Review factorisation and attempt another quiz.

Store quiz history.

Update learner progress.

==================================================

16. PAST PAPER ASSISTANT

==================================================

Create a past-paper learning tool.

Allow users to:

Upload supported documents where available

Paste a question

Enter a question manually

The AI should:

Identify subject/topic where possible.

Then provide:

Question Explanation

What the question is asking

Relevant concept

Hint

Step-by-step guidance

Final solution

Common mistake

Related practice question

IMPORTANT:

The system should prioritize teaching and understanding rather than simply giving answers.

For a question that requires learner reasoning, provide a hint before revealing the complete solution.

==================================================

17. SUBJECTS

==================================================

Create a Subjects dashboard.

Show all selected matric subjects.

Each subject card should display:

Subject name

Topics

Revision progress

Quiz score

Study hours

Upcoming exam

Weak topics

Button:

Continue Studying

Example:

MATHEMATICS

Revision:

72%

Quiz average:

81%

Weak topic:

Trigonometry

Exam:

15 October

CONTINUE STUDYING →

Progress must be based on actual user activity.

==================================================

18. PROGRESS DASHBOARD

==================================================

Create a detailed progress page.

Display:

Overall Revision Progress

Study Time

Study Sessions

Quiz Average

Topics Completed

Topics Remaining

Subject Performance

Weak Areas

Strong Areas

Recent Activity

Use charts and visual progress indicators.

Example:

Mathematics

82%

Physical Sciences

67%

Accounting

74%

English

91%

The charts must use actual user data.

==================================================

19. EXAM COUNTDOWN

==================================================

Allow users to enter exam dates.

Display:

"Mathematics Exam"

12 days remaining

"Physical Sciences"

18 days remaining

"Accounting"

24 days remaining

The countdown must automatically update.

Do not hard-code countdown values.

==================================================

20. SAVED CONTENT

==================================================

Allow learners to save:

Study guides

Summaries

Quiz results

Tutor responses

Research/learning content

Past paper explanations

Create:

Saved Content

with:

Search

Filter by subject

Sort by date

Delete

==================================================

21. SEARCH

==================================================

Create application-wide search.

Allow the learner to search:

Subjects

Topics

Saved guides

Summaries

Quiz history

Study plans

Display useful results.

==================================================

22. NOTIFICATIONS

==================================================

Create functional notifications.

Examples:

"Your Mathematics study session starts in 15 minutes."

"You completed today's study goal."

"Your Physics revision progress increased to 68%."

"You have an upcoming Mathematics exam."

Notifications should be generated from actual events where possible.

==================================================

23. SETTINGS

==================================================

Create functional settings.

Sections:

Profile

Study Preferences

Subjects

Notifications

Appearance

AI Preferences

Privacy

Account

Allow:

Dark/light mode

Notification preferences

Study reminder preferences

Update profile

Change password

Manage subjects

==================================================

24. RESPONSIBLE AI

==================================================

Responsible AI is a core requirement.

Display:

"AI-generated content may require human review."

The AI must:

- Avoid intentionally inventing information.

- Clearly acknowledge uncertainty.

- Encourage verification for important information.

- Avoid presenting generated answers as guaranteed correct.

- Encourage learning rather than dependency.

- Avoid doing all academic work without learner participation.

- Handle incomplete questions appropriately.

- Never claim to be a teacher or official examiner.

- Never claim an answer is guaranteed to match a marking guideline unless verified.

For important academic content display:

"Use your prescribed textbook, teacher, curriculum materials and official resources to verify important information."

==================================================

25. AI PROMPT ENGINEERING

==================================================

Each AI feature must use a specialized structured prompt.

Do not send raw user input directly to the model without context.

Every prompt should contain:

ROLE

TASK

CONTEXT

SUBJECT

GRADE

TOPIC

USER INPUT

DIFFICULTY

LEARNING OBJECTIVE

CONSTRAINTS

OUTPUT FORMAT

ACCURACY REQUIREMENTS

Example:

ROLE:

You are a patient South African Grade 12 study tutor.

TASK:

Teach the learner the requested topic.

CONTEXT:

The learner is preparing for matric examinations.

REQUIREMENTS:

- Explain at an appropriate Grade 12 level.

- Use clear language.

- Break difficult concepts into steps.

- Do not invent facts.

- Encourage understanding.

- Give examples where appropriate.

- Identify uncertainty.

- Provide practice questions.

- Do not reveal answers immediately when a learning opportunity exists.

OUTPUT:

Return a structured educational response with headings.

Create specialized prompts for:

Study Guide

Notes Summarizer

Study Planner

Subject Tutor

AI Assistant

Quiz Generator

Past Paper Assistant

==================================================

26. AI MODEL INTEGRATION

==================================================

Use a real AI model/API.

Keep API keys server-side.

Never expose secret API keys in client-side code.

Use environment variables.

Create a clean AI service layer so the model can be replaced later.

Example architecture:

Frontend

↓

Backend/API Route

↓

AI Service

↓

AI Model

↓

Structured Response

↓

Frontend

Handle:

Loading

Success

Error

Timeout

Rate limits

Empty responses

==================================================

27. DATABASE

==================================================

Persist user data.

Create appropriate database structures for:

Users

Profiles

Subjects

Topics

Study Sessions

Study Plans

Study Tasks

Study Guides

Summaries

Quizzes

Quiz Questions

Quiz Attempts

Past Papers

Saved Content

AI Conversations

Notifications

Exam Dates

Progress

Associate all user data with the authenticated user.

Users must only be able to access their own personal data.

==================================================

28. STUDY SESSION TRACKING

==================================================

When a learner begins a study session:

Start timer.

Allow:

Pause

Resume

Finish

When completed:

Record:

Subject

Topic

Duration

Date

Completion status

Update:

Study time

Study sessions

Progress

==================================================

29. PROGRESS CALCULATION

==================================================

Do not fake progress.

Calculate progress from real activity.

Possible calculation:

Topic completion

+

Study sessions

+

Quiz performance

+

Study plan completion

Use transparent logic.

Display progress as an estimate rather than an official academic grade.

==================================================

30. UX STATES

==================================================

Every feature must have:

Empty state

Loading state

Success state

Error state

No results state

Example loading:

"StudyEazy is preparing your study material..."

Example success:

"Study guide generated successfully."

Example error:

"Something went wrong. Please try again."

Never show a blank screen.

==================================================

31. BUTTON FUNCTIONALITY

==================================================

Every button must work.

Audit all buttons including:

Start Studying

Ask AI Tutor

Generate Study Guide

Summarize

Generate Plan

Add Task

Edit Task

Delete Task

Complete Task

Ask

Send

Generate Quiz

Submit Quiz

Restart Quiz

Upload

Save

Copy

Download

Print

Regenerate

New Chat

Clear Chat

Continue Studying

View Progress

Add Subject

Edit Subject

Save Settings

Logout

There must be ZERO dead buttons.

==================================================

32. RESPONSIVE DESIGN

==================================================

Desktop:

Sidebar visible.

Tablet:

Sidebar collapsible.

Mobile:

Sidebar becomes a drawer.

Cards:

Desktop:

3-column layout

Tablet:

2-column layout

Mobile:

1-column layout

AI interfaces must remain easy to use on mobile.

==================================================

33. ACCESSIBILITY

==================================================

Implement:

Strong color contrast

Readable typography

Keyboard navigation

Visible focus states

Accessible labels

Accessible forms

Alt text for meaningful images

Clear error messages

Do not use color as the only method of communicating status.

==================================================

34. SECURITY

==================================================

Implement:

Secure authentication

Protected routes

Server-side API keys

Input validation

Rate limiting where appropriate

User-level database permissions

No secrets in frontend code

No sensitive information in logs

Sanitize user input where necessary

==================================================

35. PERFORMANCE

==================================================

Optimize:

Page loading

AI requests

Database queries

Images

Animations

Do not use excessive animations.

Show loading indicators during AI requests.

Prevent duplicate AI requests caused by repeated clicks.

Disable generation buttons while a request is processing.

==================================================

36. DASHBOARD VISUAL STANDARD

==================================================

The dashboard must visually resemble the approved reference:

Deep navy sidebar

White/light workspace

Large rounded hero card

Soft blue/pink gradient

Rounded statistic cards

Clean three-column tool cards

Premium shadows

Subtle borders

Strong typography

Blue, pink and gold accent icons

Professional AI SaaS aesthetic

The application should feel:

Modern

Premium

Trustworthy

Academic

Youth-friendly

Professional

Do not make it look childish.

==================================================

37. DASHBOARD CONTENT

==================================================

The dashboard should display:

Hero

Statistics

AI Study Tools

Recent Activity

Upcoming Exams

Continue Studying

Suggested Revision

For example:

CONTINUE STUDYING

Mathematics

Trigonometry

72% complete

Continue →

UPCOMING EXAMS

Mathematics

12 days

Physical Sciences

18 days

RECENT ACTIVITY

Completed:

20-question Mathematics Quiz

Study session:

45 minutes — Physical Sciences

==================================================

38. PERSONALIZATION

==================================================

After login, personalize the dashboard.

Example:

"Good afternoon, Lerato."

"Ready to continue studying?"

Use the user's actual name.

Display their selected subjects.

Recommend study topics based on actual progress.

Example:

"Recommended for you"

"Review Trigonometry"

because it is identified as a weak topic.

==================================================

39. SEARCHABLE SUBJECT CONTENT

==================================================

Structure the application so subject/topic content can be expanded later.

Use:

Subject

→ Topics

→ Subtopics

→ Learning objectives

→ Practice questions

Do not hard-code the architecture around only three subjects.

==================================================

40. FUTURE-READY ARCHITECTURE

==================================================

Design the code so these can be added later:

Teacher accounts

Parent accounts

School dashboards

Study groups

Leaderboards

Premium subscriptions

More South African subjects

Official curriculum resources

Past-paper libraries

Voice tutor

AI flashcards

Spaced repetition

Mobile application

Offline study mode

Do not implement these unless needed, but structure the application so they can be added without rebuilding everything.

==================================================

41. TESTING

==================================================

Before declaring the application complete, test:

AUTHENTICATION

- Sign up

- Login

- Logout

- Password reset

NAVIGATION

- Every sidebar item

- Every dashboard button

- Back navigation

- Mobile navigation

AI

- Study guide generation

- Summarization

- Study planning

- Tutor

- Chat

- Quiz generation

- Past paper assistant

DATA

- Save

- Load

- Edit

- Delete

- User isolation

PROGRESS

- Study sessions

- Quiz results

- Subject progress

- Exam countdown

RESPONSIBLE AI

- Disclaimers

- Human review

- Uncertainty handling

RESPONSIVENESS

- Desktop

- Tablet

- Mobile

ERROR HANDLING

- Empty inputs

- API errors

- Network errors

- Invalid data

- AI timeout

==================================================

42. DEMO SCENARIO

==================================================

The final application must be easy to demonstrate.

Demo workflow:

1. Login as a matric learner.

2. Dashboard opens.

3. Select Mathematics.

4. Open AI Study Guide.

5. Enter:

   Topic: Trigonometry

6. Generate study guide.

7. Save the guide.

8. Open AI Quiz Generator.

9. Generate 10 questions about Trigonometry.

10. Complete the quiz.

11. Show score.

12. Show weak area.

13. Open Study Planner.

14. Generate a study plan based on the weak area.

15. Start a study session.

16. Open AI Tutor.

17. Ask:

   "Explain this topic in a simpler way."

18. Continue the conversation.

19. Return to dashboard.

20. Show updated progress.

This entire workflow must actually work.

==================================================

43. FINAL QUALITY REQUIREMENT

==================================================

Do not consider the application complete merely because the interface looks good.

The application is complete only when:

INPUT

↓

PROCESSING

↓

AI

↓

OUTPUT

↓

USER REVIEW

↓

SAVE / PRACTICE / COMPLETE

↓

PROGRESS UPDATE

works correctly.

Every major feature must be functional.

Every major button must work.

Every navigation item must work.

The application must be responsive.

The AI must use structured prompts.

The user's data must persist.

Progress must reflect actual activity.

The application must include responsible AI safeguards.

==================================================

44. FINAL BRAND MESSAGE

==================================================

The overall experience should communicate:

STUDYEAZY AI

STUDY SMART. PASS EAZY.

A premium AI-powered study companion for matric learners.

The application should feel like a real product that could eventually become a commercial education platform, not a school assignment mockup.

Build the complete application now.

Do not stop at the dashboard.

Implement the complete user journey and all core functionality.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ayabulela-zinzi-kwetana-ai-assistant.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/237008d9-3c62-4094-ba0a-c29d0a683683).

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
