بما أن هذا مشروع تجريبي، قمت بإبقائه بسيطاً لسهولة التشغيل المحلي. ولكن إذا أردنا نقل هذا المشروع إلى بيئة إنتاج حقيقية (Production)، سأقوم بالآتي:

استبدال SQLite بـ PostgreSQL كقاعدة بيانات خارجية لتمكين الـ High Availability ورفع الـ Replicas.

تغيير الـ Backend Service من LoadBalancer إلى ClusterIP لأسباب أمنية، واستخدام Ingress Controller لإدارة الزيارات (Routing).

عدم استخدام وسم latest في الـ Docker Images، واستخدام الـ Git Commit Hash بدلاً منه لضمان تتبع الإصدارات بدقة وتسهيل عمل ArgoCD.

إضافة Liveness و Readiness Probes للتأكد من صحة الحاويات (Containers)."




### 3. Setup Secrets
For security reasons, sensitive data is not pushed to GitHub. Please create a `secrets.yaml` file inside the `k8s-manifests` folder with the following content, then apply it:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: backend-secrets
type: Opaque
stringData:
  ADMIN_PASSWORD: "SuperSecretAdminPassword2026"
  JWT_SECRET: "your_ultra_secure_jwt_secret_key_here"
  EMAIL_PASS: "lcsdqwomvsvvrwel"



  Apply the secret before running the deployment:

    kubectl apply -f k8s-manifests/secrets.yaml