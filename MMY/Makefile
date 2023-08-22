# 构建镜像
.PHONY:build
build:
	 sudo docker buildx build  --platform=linux/amd64   -f ./${path}/Dockerfile . -t ${image}:${tag} --network=host


# 推送到镜像仓库
.PHONY:push
push:
	docker push ${image}:${tag}

# 本地删除
.PHONY:rmi
rmi:
	docker rmi ${image}:${tag}

# 运行命令(python使用)
.PHONY:run
run:
	make build && make push && make rmi


# 运行python3脚本执行<构建-推送-删除>
.PHONY:run-build
run-build:
	python3 build.py --name ${name} -t ${tag}


.PHONY:run-build-help
run-build-help:
	python3 build.py --help

# 构建与推送 end

.PHONY:rollout
rollout:
	rancher kubectl rollout restart deploy/${name}-${tag} -n resume-system