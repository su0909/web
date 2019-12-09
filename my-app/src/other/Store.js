import { observable,autorun} from "mobx";

class CommodityListDetails{
    id = observable.box("")
}

// class Tab1{
//     val = observable.box(0)
// }

// class Tab2{
//     val = observable.box(0)
// }


class asd{
    val = "123"
}


let CommodityListDetailsStore = new CommodityListDetails()
// let Tab1Store = new Tab1()
// let Tab2Store = new Tab2()

export {CommodityListDetailsStore};
// export {CommodityListDetailsStore,Tab1Store,Tab2Store};


