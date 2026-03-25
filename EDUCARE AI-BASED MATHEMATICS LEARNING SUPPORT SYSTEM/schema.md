# EDUCARE Database Schema

## Users Table
Fields:
- user_id (Primary Key)
- full_name
- email
- password
- role
- status
- created_at

## Students Table
Fields:
- student_id (Primary Key)
- user_id (Foreign Key)
- grade_level

## Teachers Table
Fields:
- teacher_id
- user_id
- specialization

## Family Table
Fields:
- family_id
- user_id
- student_id

## Topics Table
Fields:
- topic_id
- topic_name
- description

## Quiz Table
Fields:
- quiz_id
- topic_id
- total_mark

## Quiz Attempt Table
Fields:
- attempt_id
- student_id
- quiz_id
- score

## Results Table
Fields:
- result_id
- student_id
- topic_id
- quiz_id

## Gap Record Table
Fields:
- gap_id
- student_id
- topic_id
- weakness_level

## Material Table
Fields:
- material_id
- topic_id

## AI Recommendation Table
Fields:
- recommendation_id
- student_id
- topic_id
- material_id
- recommendation_text
- approved_by_teacher

## Report Table
Fields:
- report_id
- student_id
- report_date