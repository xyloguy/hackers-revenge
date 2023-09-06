   docker build -t hr/silicon-slopes-display .
   docker stop app3
   docker run -it --rm -d -p 8080:80 --name app3 hr/silicon-slopes-display
