$.ajax({
    url: 'https://canvas.cityu.edu.hk/api/v1/audit/grade_change/assignments/4016',
    method: 'POST',
    data: {access_token: '1839~YOmpTKlPYL4pmcIpn1SwF5p84LPLevBkeLpCUfUpLBzJEl38h293DLFgfzsudueE'},
    success: function(result){
        console.log(result);
    }
});

curl -H "Authorization: Bearer 1839~YOmpTKlPYL4pmcIpn1SwF5p84LPLevBkeLpCUfUpLBzJEl38h293DLFgfzsudueE" https://canvas.cityu.edu.hk/api/v1/users/22094/account_notifications

