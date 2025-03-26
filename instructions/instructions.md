## Project Overview

We are building ATS appliacation. List of Jobs, Job Detail, List application on Job etc. 

## Current state

Now we have alreade prepare some prototype which you can use. There exist some components. 

## CHANGES

- I want make order in folder structure mainly in components
    - Delete unused file or components
    - I want make other subfolder in components like "Job", "Eshop", "Advert" in context of use of components
    - Update import to work app properly 
- Current UI is fine so ypou can keep it. 
- I want change mock data to use data from big json file i will show example
    - Now mock data is prepare via function
    - Job Atributes NEW structure (its inmportant)
        - title: String
        - status: ["Aktivní", "Rozpracovaný", "Archivní"]
        - location: string
        - recruiter: array of object
        - assignedUsers: array of object
        - candidates: object
        - advertisement: object, its important because inside advertisment is other active: bool
        - performance: object
    - Mock data example
            {
            "id": "JOB-001",
            "status": "Aktivní",
            "title": "Senior React Developer",
            "location": "Praha",
            "recruiter": {
            "id": "REC-001",
            "name": "Anna Kovářová",
            "role": "Senior Recruiter"
            },
            "assignedUsers": [
            {
                "id": "USR-001",
                "name": "Anna Kovářová",
                "role": "Senior Recruiter"
            },
            {
                "id": "USR-002",
                "name": "Petr Novák",
                "role": "HR Manager"
            }
            ],
            "candidates": {
            "new": 5,
            "inProcess": 3,
            "total": 14
            },
            "advertisement": {
            "active": true,
            "status": "Vystavený",
            "portals": [
                {
                "name": "jobs.cz",
                "publishedAt": "2023-10-15",
                "expiresAt": "2023-11-15",
                "performance": {
                    "views": 432,
                    "clicks": 78,
                    "applications": 12
                }
                },
                {
                "name": "linkedin.com",
                "publishedAt": "2023-10-15",
                "expiresAt": "2023-11-15",
                "performance": {
                    "views": 267,
                    "clicks": 54,
                    "applications": 8
                }
                }
            ]
            },
            "performance": {
            "views": 699,
            "clicks": 132,
            "applications": 20
            }
        },
- With Job atribute has to work filter, same atrinutes to filter (job-filters.tsx)
    - Filter options (like job atrinutes)
- And we work with Views(job-views.tsx)
    - Now it work badly
    - i want to achive to work that there is preddefined view which collect some filter 
        - Aktivní
            - status: Aktivní
        - Zveřejněný
            - status: Aktivní
            - advertisement.active: true
        - Nezveřejněný
            - status: Aktivní
            - advertisement.active: false
        - Rozpracovaný
            - status: Rozpracovaný
        - Archivní
            - status: Archivní


