import ViteJS from '../../index.js';

const IPC_RPC = new ViteJS.IPC_RPC({
    path: '/Users/sisi/viteisbest/vite.ipc',
    timeout: 200
});

let resultCount = 0;
function addResCount() {
    resultCount++;
    if (resultCount ===  2) {
        IPC_RPC.disconnect();
    }
}

IPC_RPC.on('connect', ()=>{
    describe('ipc_rpc_notification', function () {
        it('notification_no_method', function (done) {
            let err = IPC_RPC.notification();
            addResCount();
            done(!err);
        });
    
        it('notification_success', function (done) {
            let err = IPC_RPC.notification('wallet.ReloadAndFixAddressFile');
            addResCount();
            done(err);
        });
    });
});