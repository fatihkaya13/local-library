### Create database named locallibrary

```
CREATE DATABASE locallibrary
```

### Create table named as book on locallibrary database
```
CREATE TABLE locallibrary.book (
    id UUID, 
    title String, 
    author_id UUID,
    summary String,
    isbn String,
    genre_id UUID
) 
ENGINE = MergeTree()
PRIMARY KEY(id)
```

### Create table named as author on locallibrary database
```
CREATE TABLE locallibrary.author (
    id UUID, 
    first_name String, 
    family_name String,
    date_of_birth Date,
    date_of_death Date
) 
ENGINE = MergeTree()
PRIMARY KEY(id)
```

### Create table named as genre on locallibrary database
```
CREATE TABLE locallibrary.genre (
    id UUID, 
    name String
) 
ENGINE = MergeTree()
PRIMARY KEY(id)
```

### insert mock data to book table
```
INSERT INTO locallibrary.book
VALUES (generateUUIDv4(), 'Ghosts', generateUUIDv4(), 'scary ghost stories', 'ISBN291021', generateUUIDv4())
```

### join statement for book and author table
```
select locallibrary.author.first_name
from locallibrary.book
join locallibrary.author
on locallibrary.author.id = locallibrary.book.author_id
```

### delete data from book table where title is named as Ghosts
```
ALTER TABLE locallibrary.book DELETE WHERE title = 'Ghosts'
```

### insert mock data to genre table
```
INSERT INTO locallibrary.genre
VALUES (generateUUIDv4(), 'drama')
```