<img src="docs/resc/logotype-wip-hq.png">

Fiesta is an event management platform designed to make the lives of event 
planners easier. Fiesta 1.0's planned public launch date is March 31, 2015. Get
 cranking!

## Installation

```
$ git clone https://github.com/joshbeitler/fiesta
$ cd fiesta
$ npm install
$ sails lift
```

## Work Items

Check out the [Issues](https://github.com/joshbeitler/fiesta/issues) page for
tasks to work on. If you find something nice looking, assign yourself to the
task and get going! (see workflow below)

If you find a bug or have an idea for a new feature, create a new issue for said
issue or idea. Be sure to add the proper milestones, assignees, and labels to
any issues you create. Add a description with notes, diagrams, or whatever if
needed.

## Workflow

In order to keep things nice and pretty, a new fancy workflow has been
implemented. Keep your feature on a seperate branch, then merge into master
when needed. Here's how it might work:

1. Clone repo
2. Decide what to work on, create new branch from master
3. Work on feature
4. Create pull request into master when finished
5. Wait for another team member to merge pull request for you. This forces us
to look at eachother's code and keep things clean.
6. Delete feature branch when pull request is accepted
7. Profit.

Please note that since we are not on hackathon schedule anymore, your commit
messages should be nice and informative - this is just good programming
practice. For example, the commit messages "add stuff" or "ajlkfdak" may have
been acceptable at Codecamp, but they are not anymore. Good commit messages
describe what changed and nothing more. For example: "Add testFunc() function to
EventController to monitor API requests".