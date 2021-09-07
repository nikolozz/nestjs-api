import * as cluster from 'cluster';
import * as os from 'os';

export function runInCluster(bootstrap: () => Promise<void>) {
  const cpus = os.cpus().length;
  if (cluster.isMaster) {
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
  } else {
    bootstrap();
  }
}
