# User Prompts

## 1. Initial Request
i'd like for you to create a webapp using vite and typescript that visualizes our solar system. i want to be able to change the time scale so i can see the planets rotating and orbiting the sun. i would like to have a skybox of the stars visible. we should be able to toggle constellation display on/off. we should be able to also see the moon orbiting the earth. we should be able to display text labels (or turn off) for each large body. we don't care about the moons on other planets, only earth. earth should have a texture wrapped on it so it looks like earth. the other planets should also have nice textures on them too. i'd like to be able to adjust the scale of planets to be somewhat unrealistic, so basically adjust a minimum planet size setting. and maybe also a minimum moon size setting. in addition i would like some camera/viewport control. we should be able to go into fullscreen and use the mouse to look around and arrow keys to move

## 2. Automated Tests Feedback
i can think of some automated tests like let 365.24... days pass and check that earth is roughly in the same position. check that earth rotates around every day. things like that. i want you to have time scale accurate basic orbit speeds and elliptical paths. so i want specific tests for each planet's orbit. ideally you would also have a test that checks the positions of the planets on a given date, and then runs simulation for x years, then again checks the positions too. i don't want to get too in the weeds about relative orbit shift periods etc, but just want how many earth days is a day on each planet, and how many earth years is a year for each planet, etc, so the speeds of the orbits around earth is relatively accurate. also the speeds should change depending on where they are in the ellispe of course. you may need to bring in some heavier math libraries

## 3. Bug Report (Console Error)
I see this error in the console:
[Error log omitted for brevity]
why is it minimized? chunk-*. I did npm run dev. Maybe you should add a playwright test to load up the app after building (without minification, native modules for easier debugging) and verify any error output in console, so you can work on this error autonomously.

## 4. Playwright Headless Request
can you please use playwright headless=new so you dont bring up windows to the foreground taking focus on my computer that i'm working on. or let it be configurable with an env var if it's visible to me or not.

## 5. Gitignore Request
can you make a gitignore file to ignore build artifacts etc

## 6. Camera Control Refactor
the camera movement with the mouse makes me dizzy since the left/right is controlling roll angle. i want it to be yaw. so it works like a normal FPS game (mouse controls pitch/yaw, not roll). lets let the Q and E keys control the roll though.

## 7. Archive Request
i want you to archive the tasks, plan, and walkthrough into a docs/agent_artifacts folder. please also create a user-prompts file there where you store all the prompts and instructions i gave you
