#!/bin/bash
javac -classpath /usr/share/java/postgresql-jdbc4.jar Database.java test.java
java -classpath /usr/share/java/postgresql-jdbc4.jar:. test