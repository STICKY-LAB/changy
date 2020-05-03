
# Array<Changeable<any>>에 대해
Array는 배열의 요소의 값이 변경되었을 때가 아닌, 배열이 변경되었을 때에 이벤트를 발생시킵니다.
즉 Primitive를 요소로 사용한다고 해도 Array에서는 이를 감지할 방법이 없습니다.
단순히 배열 형태로 담겨져 있는 값을 넘기기 위해서라면 일반적인 Array을 사용해야 합니다.
다만 여러개의 Changeable을 넘기는 것 자체가 목적이라면 Changeable을 요소로 사용할 수 있습니다.

단순한 배열 형태의 값을 넘기는 것을 목적으로 하는 경우 :
1. 일반 함수의 배열 입력을 Array로 처리하는 경우
2. 최댓값을 얻어낼 목적의 값들로 Array를 만드는 경우

여러개의 Changeable을 넘기는 것을 목적으로 하는 경우:
1. 일반 함수의 ...args를 Changeable 함수로 만드는 과정에서 이를 Array로 처리하는 경우
2. Changeable들에서 최댓값을 얻어낼 목적의 Changeable들만 필터해 Array를 만드는 경우