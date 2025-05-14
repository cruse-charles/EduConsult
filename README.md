# EduConsult

[Live Link!](https://edu-consult-iota.vercel.app/)

## Background and Overview
EduConsult is a web app built with Next.js and Firebase to help education consultants and students streamline their workflow. It provides a centralized platform for:

+ Managing student portfolios
+ Tracking assignments & due dates
+ Researching universities & opportunities

## Features
### Portfolio Management
Consultants can easily create assignments that are categorized and easily tracked throughout its work in progress cycle since updates to an assignment are all done in one place. Without the mess of looking through tons of messages, emails, and other assignments, both consultants and students save time and effort.

### Assignment Tracking
Get an idea of what assignments are due immediately for both consultants and students. With highlights and calendars that update in the backend and on assignment submission, you're always up-to-date on what you need to do.

<!-- ### University Research -->

## Tech Stack
- **Frontend**: Next.js, TailwindCSS, shadcn/ui  
- **Backend**: Firebase Firestore, Firebase Auth  
- **Other Tools**: Vercel (deployment), Python (for scraping/analytics) 

## Roadmap
- University research scraper & analytics  
- Consultant billing & time tracking    


## Developer Notes

If the calendar popover/modal becomes unclickable, check for updates to `@radix-ui/react-dialog` and `@radix-ui/react-popover` in the package.json. 
Some versions change pointer-events or portal behavior and may break UI interactions.