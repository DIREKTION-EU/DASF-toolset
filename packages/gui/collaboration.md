# Collaboration

A quick summary of how a facilitator can collaborate with users and solution providers during a workshop.

## Assumption

All data is stored locally in the browser, no data is stored on servers.

## Flow

```mermaid
sequenceDiagram
    autonumber
    actor Facilitator
    actor User
    participant Toolset
    participant Mail

    par Step 0 and 1: Select hazards and determine capability gaps
        Facilitator ->> Toolset: Step 0: Create and select new hazards
        Facilitator ->> Toolset: Step 1a: Select capabilities that need to be assessed
        Facilitator ->> Toolset: Step 1b: Initiate a collaboration request
        Facilitator ->> Toolset: Set facilitator's name and email
        Facilitator ->> Toolset: Select stakeholder assessment
        Toolset ->> Mail: Create email with permalink
        Facilitator ->> Mail: Send email with permalink to stakeholders (in BCC)
        Mail ->> User: Receive email with permalink. Click to open
        User ->> Toolset: Assess capabilities until DONE
        Toolset ->> Mail: Done: create email with permalink to Facilitator
        Mail ->> Facilitator: Receive email with permalink. Click to open
        Facilitator ->> Toolset: Step 1c: Load assessment results and prioritise
    end
    par Step 2 and 3: Select solutions and set roadmap
        Facilitator ->> Toolset: Step 2: Create solutions
        Facilitator ->> Toolset: Step 3: Set roadmap
        Facilitator ->> Toolset: Step 2b: Initiate a collaboration request
        Facilitator ->> Toolset: Select solution assessment
        Toolset ->> Mail: Create email with permalink
        Facilitator ->> Mail: Send email with permalink to solution providers (in BCC)
        Mail ->> User: Receive email with permalink. Click to open
        User ->> Toolset: Assess solutions until DONE
        Toolset ->> Mail: Done: create email with permalink to Facilitator
        Mail ->> Facilitator: Receive email with permalink. Click to open
        Facilitator ->> Toolset: Step 2c: Load assessment results and finalise roadmap
    end
    
```
