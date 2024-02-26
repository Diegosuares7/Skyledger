FROM public.ecr.aws/lambda/nodejs:20 as builder
WORKDIR ${LAMBDA_TASK_ROOT}
COPY .  .
RUN npm install
RUN npm install -D @types/aws-lambda esbuild
RUN npm i ts-node
RUN npm run build
COPY src/assets ./dist/assets
COPY src/transformers/assets ./dist/transformers/assets
CMD ["dist/index.handler"]