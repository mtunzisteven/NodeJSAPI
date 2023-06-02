# The base image we are starting from
FROM node

# the working directory where all commands will be executed in the 
WORKDIR /app

# First dot: copy all files and folders in the current project, eg: talentShare\API into image
# Second dot, dot fwd slash, or /app tells docker which folder to copy all the files above into
COPY . /app

# telling docker what to do once files and folders are coppied.
RUN npm install

# as a docker container is isolated, we expose port to allow us to access it when container app is running
# an optional step just for documentation. Use: "docker run -p 8080:8080 id" to make port available for app use
EXPOSE 8080

# we tell docker how to start our node app in the container(start our container basically)
# build Docker container image with: "docker build ."
CMD ["npx", "nodemon"]