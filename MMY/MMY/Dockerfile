FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
#
#RUN sed -i 's@/deb.debian.org/@/mirrors.aliyun.com/@g' /etc/apt/sources.list 
#RUN apt-get update
#RUN apt-get install apt-utils libgdiplus libc6-dev -y
#RUN apt-get install fontconfig -y
#RUN apt-get install wget -y
#RUN wget -O /usr/share/fonts/mryh.ttf http://dev.dianmi-north.cn:32110/fonts/微软雅黑.ttf
#RUN fc-cache -vf
#RUN fc-list
#RUN apt-get clean
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/' /etc/ssl/openssl.cnf
RUN sed -i 's/CipherString = DEFAULT@SECLEVEL=2/CipherString = DEFAULT@SECLEVEL=1/' /etc/ssl/openssl.cnf

# timezone
RUN /bin/cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 
FROM base AS final
WORKDIR /app
COPY ./MMY/bin/Release/net7.0/linux-x64/publish/ .
ENTRYPOINT ["dotnet", "MMY.dll"]
